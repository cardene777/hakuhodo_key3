from django.contrib import admin
from .models import User


@admin.register(User)
class UsersAdmin(admin.ModelAdmin):
    items: list = [
        "wallet_address",
        "email",
        "tokenId",
    ]
    list_display = items
    list_filter = items
    search_fields = items
