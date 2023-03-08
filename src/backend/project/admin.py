from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "summary",
        "description",
        "purpose",
        "project_deadline",
        "contact",
        "vote_deadline",
    )
    list_filter = ("name", "summary", "description", "purpose", "contact")
    search_fields = ("name", "summary", "description", "purpose", "contact")
