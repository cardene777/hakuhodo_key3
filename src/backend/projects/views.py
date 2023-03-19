# import django_filters
from rest_framework import viewsets

from .models import Project
from .serializer import ProjectsSerializer


class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectsSerializer
