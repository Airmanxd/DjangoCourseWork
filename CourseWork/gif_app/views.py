from .models import Gif
from rest_framework import parsers, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import GifSerializer

# Create your views here.

class GifViewSet(viewsets.ModelViewSet):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {'retrieve': [permissions.AllowAny],
                                    'list': [permissions.AllowAny]}

    def perform_create(self, serializer):
        serializer.validated_data['tags'] = {"1" : serializer.validated_data['tags']}
        return super().perform_create(serializer)
        
    @action(detail=False, url_path='tags', url_name="get_all_tags", permission_classes=[permissions.AllowAny])
    def tags(self, request):
        data = Gif.objects.values_list('tags', flat=True)
        res = set()
        for val in data:
            res.update(val['1'])
        return Response(res)
    @action(detail=False, permission_classes=[permissions.AllowAny], url_path='filtered', url_name="filtered")
    def filtered_gifs(self, request):
        data = Gif.objects
    
    def list(self, request, *args, **kwargs):
        data = Gif.objects
        if len(request.query_params().get('tag')):
            for tag in request.query_params().get('tag'):
                data.filter(tags__1=tag)
        return Response(data.all())


    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]


    