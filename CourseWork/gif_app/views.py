from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import Gif
from rest_framework import parsers, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from .serializers import GifSerializer

# Create your views here.

class GifViewSet(viewsets.ModelViewSet):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {'retrieve': [permissions.AllowAny],
                                    'list': [permissions.AllowAny],
                                    'likes' : [permissions.IsAuthenticated],
                                    'tags' : [permissions.AllowAny]}


    def perform_create(self, serializer):
        serializer.validated_data['tags'] = {"1" : serializer.validated_data['tags']}
        if serializer.validated_data['name'] == '':
            serializer.validated_data['name'] = serializer.validated_data['file']
        return super().perform_create(serializer)
        

    @action(detail=False, url_path='tags', url_name="get_all_tags")
    def tags(self, request):
        data = Gif.objects.values_list('tags', flat=True)
        res = set()
        for val in data:
            res.update(val['1'])
        return Response(res)

    
    def list(self, request, *args, **kwargs):
        data = Gif.objects
        if request.query_params.get('tag'):
            for tag in request.query_params().get('tag'):
                data.filter(tags__1=tag)
        query = data.all()
        serializer = self.serializer_class(query, many=True)
        offset = request.query_params.get('offset')

        page = self.paginate_queryset(query)
        serializer = self.get_serializer(page, many=True)
        return Response({"gifs" : serializer.data,
                        "hasMore" : self.is_more_data(offset)})


    @action(detail=False, url_path='likes', url_name="get_all_likes")
    def likes(self, request):
        qs = request.user.liked.all()
        serializer = self.serializer_class(qs, many=True)
        offset = request.query_params.get('offset')

        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page, many=True)
        
        return Response({"gifs" : serializer.data,
                        "hasMore" : self.is_more_data(offset)})


    def is_more_data(self, offset):
        return self.queryset.count() > int(offset)


    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

