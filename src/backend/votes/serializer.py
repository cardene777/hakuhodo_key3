from rest_framework import serializers

from .models import Vote


class VotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = (
            "users",
            "proposal",
            "vote",
        )
