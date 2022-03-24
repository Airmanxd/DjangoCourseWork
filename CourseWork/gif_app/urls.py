from django.urls import path
from rest_framework import routers
from gif_app.views import GifViewSet

router = routers.DefaultRouter()
router.register('gifs', GifViewSet)
urlpatterns = router.urls

