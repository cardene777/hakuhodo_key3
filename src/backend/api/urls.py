from django.urls import path, include
from django.contrib import admin

from projects.urls import router as projects_router

urlpatterns = [
    path("admin/", admin.site.urls),
]

urlpatterns += [
    path(r"api/", include(projects_router.urls)),
]
