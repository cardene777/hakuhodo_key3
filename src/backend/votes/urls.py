from rest_framework import routers
from .views import VotesViewSet


router = routers.DefaultRouter()
router.register(r'votes', VotesViewSet)
