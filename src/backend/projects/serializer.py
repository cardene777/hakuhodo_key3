from rest_framework import serializers

from .models import Project


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("name", "summary", "description", "purpose", "project_deadline", "contact", "vote_deadline")
