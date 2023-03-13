from rest_framework import serializers

from .models import Proposal


class ProposalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = (
            "users",
            "projects",
            "title",
            "description"
        )
