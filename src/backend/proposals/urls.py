from rest_framework import routers
from .views import ProposalsViewSet


router = routers.DefaultRouter()
router.register(r'proposals', ProposalsViewSet)
