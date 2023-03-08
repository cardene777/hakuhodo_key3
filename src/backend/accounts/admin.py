from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAdminCustom(UserAdmin):
    # User Details
    fieldsets = (
        (None, {
            'fields': (
                'name',
                'email',
                'password',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )
    # Add User
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'name',
                'email',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superuser',
            ),
        }),
    )

    # User List
    list_display = (
        'id',
        'name',
        'email',
        'is_active',
    )

    list_filter = ()
    # Search
    search_fields = ('email',)
    # Order
    ordering = ('id',)


admin.site.register(User, UserAdminCustom)
