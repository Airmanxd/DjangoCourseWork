from .models import Gif
from rest_framework import parsers
from rest_framework import generics
from .serializers import GifSerializer

# Create your views here.

class GifCreateAPIView(generics.CreateAPIView):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]

    def perform_create(self, serializer):
        serializer.validated_data['categories'] = {"1" : serializer.validated_data['categories']}
        return super().perform_create(serializer)

class GifReadAPIView(generics.RetrieveAPIView):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer

class GifDeleteAPIView(generics.DestroyAPIView):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    lookup_field = 'pk'