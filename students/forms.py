from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Student
from .models import (
    Announcement,
    Assignment,
    AssignmentSubmission,
    AttendanceRecord,
    DirectMessage,
    ExtracurricularRecord,
    SavedFilterPreset,
    StudentSkill,
    SupportTicket,
    SupportTicketMessage,
)


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ["name", "roll_number", "course", "email", "phone", "notes", "year", "status"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Student full name"}),
            "roll_number": forms.TextInput(attrs={"placeholder": "Roll number"}),
            "course": forms.TextInput(attrs={"placeholder": "Course name"}),
            "email": forms.EmailInput(attrs={"placeholder": "Email address"}),
            "phone": forms.TextInput(attrs={"placeholder": "Phone number"}),
            "notes": forms.Textarea(attrs={"rows": 3, "placeholder": "Optional notes about student profile"}),
            "year": forms.NumberInput(attrs={"min": 1, "max": 8}),
        }


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")


class AttendanceForm(forms.ModelForm):
    class Meta:
        model = AttendanceRecord
        fields = ["date", "status", "notes"]


class StudentSkillForm(forms.ModelForm):
    class Meta:
        model = StudentSkill
        fields = ["skill", "level", "notes"]


class ExtracurricularForm(forms.ModelForm):
    class Meta:
        model = ExtracurricularRecord
        fields = ["activity_name", "role", "achievement", "date"]


class AssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ["title", "description", "course", "year", "due_date", "attachment"]


class AssignmentSubmissionForm(forms.ModelForm):
    class Meta:
        model = AssignmentSubmission
        fields = ["file", "text_answer"]


class AnnouncementForm(forms.ModelForm):
    class Meta:
        model = Announcement
        fields = ["title", "body", "send_email", "send_sms"]


class DirectMessageForm(forms.ModelForm):
    class Meta:
        model = DirectMessage
        fields = ["recipient", "message"]


class TicketForm(forms.ModelForm):
    class Meta:
        model = SupportTicket
        fields = ["title", "description"]


class TicketReplyForm(forms.ModelForm):
    class Meta:
        model = SupportTicketMessage
        fields = ["message"]


class SavedFilterPresetForm(forms.ModelForm):
    class Meta:
        model = SavedFilterPreset
        fields = ["name"]
