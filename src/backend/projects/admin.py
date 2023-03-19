from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectsAdmin(admin.ModelAdmin):
    items: list = [
        "title",
        "logo",
        "description",
        "purpose",
        "deadline",
        "vote_deadline",
        "phase",
        "invalid"
    ]
    list_display = items
    list_filter = items
    search_fields = items
