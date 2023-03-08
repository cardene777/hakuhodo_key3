from django.urls import path, include
from django.contrib import admin

from project.urls import router as project_router
from accounts.urls import router as accounts_router

urlpatterns = [
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path(r"api/", include(accounts_router.urls)),
    path(r"api/", include(project_router.urls)),
    path("admin/", admin.site.urls),
]
