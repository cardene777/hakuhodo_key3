from django.urls import path
from .views import UserViewSet
from rest_framework import routers

# urlpatterns = [
#     path("users/", UserList.as_view()),
# ]


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
