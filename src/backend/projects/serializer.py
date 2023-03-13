from rest_framework import serializers

from .models import Project


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "title",
            "logo",
            "description",
            "purpose",
            "deadline",
            "vote_deadline",
            "phase",
            "invalid"
        )
