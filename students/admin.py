from django.contrib import admin
from .models import (
    ActivityLog,
    Announcement,
    Assignment,
    AssignmentSubmission,
    AttendanceRecord,
    DirectMessage,
    ExtracurricularRecord,
    SavedFilterPreset,
    SkillTag,
    Student,
    StudentSkill,
    SupportTicket,
    SupportTicketMessage,
)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "roll_number", "course", "year", "status", "email", "updated_at")
    list_filter = ("course", "year", "status")
    search_fields = ("name", "roll_number", "course", "email", "phone")


admin.site.register(SkillTag)
admin.site.register(StudentSkill)
admin.site.register(ExtracurricularRecord)
admin.site.register(AttendanceRecord)
admin.site.register(Assignment)
admin.site.register(AssignmentSubmission)
admin.site.register(Announcement)
admin.site.register(DirectMessage)
admin.site.register(SupportTicket)
admin.site.register(SupportTicketMessage)
admin.site.register(SavedFilterPreset)
admin.site.register(ActivityLog)
