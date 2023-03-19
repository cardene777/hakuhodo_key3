# import django_filters
from rest_framework import viewsets

from .models import Proposal
from .serializer import ProposalsSerializer


class ProposalsViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalsSerializer
