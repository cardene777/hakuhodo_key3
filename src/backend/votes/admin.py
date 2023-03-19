from django.contrib import admin
from .models import Vote


@admin.register(Vote)
class VotesAdmin(admin.ModelAdmin):
    items: list = [
        "users",
        "proposal",
        "vote",
    ]
    list_display = items
    list_filter = items
    search_fields = items
