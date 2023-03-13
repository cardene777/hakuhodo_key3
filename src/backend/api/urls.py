from django.urls import path, include
from django.contrib import admin

from projects.urls import router as projects_router
from proposals.urls import router as proposals_router
from users.urls import router as users_router
from votes.urls import router as votes_router

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)
+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path(r"api/", include(projects_router.urls)),
    path(r"api/", include(proposals_router.urls)),
    path(r"api/", include(users_router.urls)),
    path(r"api/", include(votes_router.urls)),
]
