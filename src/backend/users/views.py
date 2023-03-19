# import django_filters
from rest_framework import viewsets

from .models import User
from .serializer import UsersSerializer


class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer
