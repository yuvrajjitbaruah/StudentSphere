from django.contrib.auth.models import Group, User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from django.urls import reverse
import sys
from unittest import skipIf

from .models import Student


class StudentPortalTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="tester", password="Test@12345")
        faculty_group, _ = Group.objects.get_or_create(name="faculty")
        self.user.groups.add(faculty_group)
        self.student = Student.objects.create(
            name="Alice",
            roll_number="R001",
            course="CS",
            email="alice@example.com",
            phone="12345",
            year=2,
            status="active",
        )

    @skipIf(sys.version_info >= (3, 14), "Django 4.2 test template instrumentation is unstable on Python 3.14")
    def test_home_page_loads_with_3d_canvas(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'id="hero3d"')

    def test_dashboard_requires_auth(self):
        response = self.client.get(reverse("student_list"))
        self.assertEqual(response.status_code, 302)

    def test_student_crud_flow(self):
        self.client.login(username="tester", password="Test@12345")
        create_response = self.client.post(
            reverse("student_create"),
            {
                "name": "Bob",
                "roll_number": "R002",
                "course": "Math",
                "email": "bob@example.com",
                "phone": "998877",
                "year": 1,
                "status": "active",
            },
        )
        self.assertEqual(create_response.status_code, 302)
        bob = Student.objects.get(roll_number="R002")

        update_response = self.client.post(
            reverse("student_update", args=[bob.id]),
            {
                "name": "Bob Updated",
                "roll_number": "R002",
                "course": "Math",
                "email": "bob@example.com",
                "phone": "111222",
                "year": 2,
                "status": "inactive",
            },
        )
        self.assertEqual(update_response.status_code, 302)
        bob.refresh_from_db()
        self.assertEqual(bob.name, "Bob Updated")

        delete_response = self.client.post(reverse("student_delete", args=[bob.id]))
        self.assertEqual(delete_response.status_code, 302)
        self.assertFalse(Student.objects.filter(roll_number="R002").exists())

    def test_students_api_returns_data(self):
        self.client.login(username="tester", password="Test@12345")
        response = self.client.get(reverse("students_api"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("students", response.json())
        self.assertGreaterEqual(len(response.json()["students"]), 1)

    def test_csv_import_for_superuser(self):
        admin = User.objects.create_superuser("admin2", "admin2@example.com", "Admin@12345")
        self.client.login(username="admin2", password="Admin@12345")
        csv_content = (
            "Name,Roll Number,Course,Email,Phone,Year,Status\n"
            "Charlie,R003,Physics,charlie@example.com,111,3,active\n"
        )
        upload = SimpleUploadedFile("students.csv", csv_content.encode("utf-8"), content_type="text/csv")
        response = self.client.post(reverse("students_import_csv"), {"csv_file": upload})
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Student.objects.filter(roll_number="R003").exists())
