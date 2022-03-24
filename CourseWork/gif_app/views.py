from .models import Gif
from rest_framework import parsers, viewsets, permissions
from .serializers import GifSerializer

# Create your views here.

class GifViewSet(viewsets.ModelViewSet):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.validated_data['categories'] = {"1" : serializer.validated_data['categories']}
        return super().perform_create(serializer)

    