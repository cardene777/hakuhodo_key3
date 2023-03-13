from django.contrib import admin
from .models import Proposal


@admin.register(Proposal)
class ProposalsAdmin(admin.ModelAdmin):
    items: list = [
        "users",
        "projects",
        "title",
        "description"
    ]
    list_display = items
    list_filter = items
    search_fields = items
