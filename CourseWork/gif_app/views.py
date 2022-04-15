import collections
from django.db.models import Q
import operator
from functools import reduce
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
    permission_classes = [permissions.AllowAny]
    permission_classes_by_action = {'create' : [permissions.IsAuthenticated],}


    def perform_create(self, serializer):
        # serializer.validated_data['tags'] = {"1" : serializer.validated_data['tags']}
        if self.request.user.is_authenticated:
            serializer.validated_data['uploader'] = self.request.user.username
        if serializer.validated_data['name'] == '':
            serializer.validated_data['name'] = serializer.validated_data['file']
        
            return super().perform_create(serializer)
        

    @action(detail=False, url_path='tags', url_name="get_all_tags")
    def tags(self, request):
        data = Gif.objects.values_list('tags', flat=True)
        res = set()
        for val in data:
            res.update(val)
        return Response(res)

    
    def list(self, request, *args, **kwargs):
        query_params = request.query_params.copy()
        qs = self.get_queryset()
        """
        deals with tags
        if 'likes' is passed in the tags then changes the query to users liked gifs
        """
        if 'tag' in query_params.keys():
            tags = query_params.pop('tag')

            if 'Liked' in tags and self.request.user.is_authenticated:
                qs=self.request.user.likes.all()

            for tag in tags:
                qs = qs.filter(tags__icontains=tag)
        
        offset = query_params.get('offset')
        
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page, many=True)
        return Response({"gifs" : serializer.data,
                        "hasMore" : self.has_more_data(offset)})


    @action(detail=False, url_path='likes', url_name="get_all_likes")
    def likes(self, request):
        qs = request.user.liked.all()
        serializer = self.serializer_class(qs, many=True)
        offset = request.query_params.get('offset')

        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page, many=True)
        
        return Response({"gifs" : serializer.data,
                        "hasMore" : self.has_more_data(offset)})


    def has_more_data(self, offset):
        return self.queryset.count() > int(offset)


    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

