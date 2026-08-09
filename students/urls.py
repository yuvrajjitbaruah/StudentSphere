from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("dashboard/", views.student_list, name="student_list"),
    path("accounts/signup/", views.signup, name="signup"),
    path("students/<int:pk>/", views.student_detail, name="student_detail"),
    path("students/add/", views.student_create, name="student_create"),
    path("students/<int:pk>/edit/", views.student_update, name="student_update"),
    path("students/<int:pk>/delete/", views.student_delete, name="student_delete"),
    path("students/<int:pk>/duplicate/", views.duplicate_student, name="student_duplicate"),
    path("students/bulk-delete/", views.bulk_delete_students, name="students_bulk_delete"),
    path("students/bulk-status/", views.bulk_update_status, name="students_bulk_status"),
    path("students/presets/save/", views.save_filter_preset, name="save_filter_preset"),
    path("students/presets/<int:preset_id>/apply/", views.apply_filter_preset, name="apply_filter_preset"),
    path("students/presets/<int:preset_id>/delete/", views.delete_filter_preset, name="delete_filter_preset"),
    path("students/export/csv/", views.export_students_csv, name="students_export_csv"),
    path("students/export/activity-csv/", views.export_activity_csv, name="students_export_activity_csv"),
    path("students/import/csv/", views.import_students_csv, name="students_import_csv"),
    path("api/students/", views.students_api, name="students_api"),
    path("api/analytics/", views.analytics_api, name="analytics_api"),
    path("api/support-chat/", views.support_ai_chat_api, name="support_ai_chat_api"),

    # --- Attendance, skills & extracurriculars (per-student records) ---
    path("students/<int:pk>/attendance/", views.attendance_tracking, name="attendance_tracking"),
    path("students/<int:pk>/skills/", views.student_skill_records, name="student_skill_records"),
    path("students/<int:pk>/extracurricular/", views.extracurricular_records, name="extracurricular_records"),

    # --- Assignments & grading workflow ---
    path("assignments/", views.assignment_list, name="assignment_list"),
    path("assignments/create/", views.assignment_create, name="assignment_create"),
    path("assignments/<int:pk>/submit/", views.assignment_submit, name="assignment_submit"),
    path("assignments/submissions/<int:pk>/grade/", views.submission_grade, name="submission_grade"),
    path("assignments/publish-results/", views.publish_results, name="publish_results"),
    path("assignments/submissions/export/csv/", views.export_submissions_csv, name="export_submissions_csv"),
    path("report-card/", views.report_card_view, name="report_card"),

    # --- Announcements ---
    path("announcements/", views.announcement_list_create, name="announcement_list"),

    # --- Direct messaging ---
    path("chat/", views.chat_room, name="chat_room"),

    # --- Support tickets ---
    path("tickets/", views.ticket_list_create, name="ticket_list"),
    path("tickets/<int:pk>/", views.ticket_detail, name="ticket_detail"),
]
