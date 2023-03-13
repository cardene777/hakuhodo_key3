# import django_filters
from rest_framework import viewsets

from .models import Vote
from .serializer import VotesSerializer


class VotesViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VotesSerializer
