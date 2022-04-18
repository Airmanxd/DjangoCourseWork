from .models import Gif
from rest_framework import parsers, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, authentication_classes
from .serializers import GifSerializer

class GifViewSet(viewsets.ModelViewSet):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.AllowAny]
    permission_classes_by_action = {'create' : [permissions.IsAuthenticated],
                                    'likes' : [permissions.IsAuthenticated],
                                    'liked_gifs' : [permissions.IsAuthenticated],}
    

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.validated_data['uploader'] = self.request.user.username
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
        offset = query_params.get('offset')
        """
        deals with tags
        if 'likes' is passed in the tags then changes the query to users liked gifs
        """
        if 'tag' in query_params.keys():
            tags = query_params.pop('tag')

            if 'Liked' in tags:
                if self.request.user.is_authenticated:
                    qs=self.request.user.likes.all()
                    print(qs)
                    page = self.paginate_queryset(qs)
                    serializer = self.get_serializer(page, many=True)
                    return Response({"gifs" : serializer.data,
                                    "hasMore" : self.has_more_data(offset)})
                else:
                    return Response(status=401)

            for tag in tags:
                qs = qs.filter(tags__icontains=tag)
            print(qs)
        
        if offset:
            page = self.paginate_queryset(qs)
            serializer = self.get_serializer(page, many=True)
            return Response({"gifs" : serializer.data,
                            "hasMore" : self.has_more_data(offset)})
        else:
            serializer = self.get_serializer(qs, many=True)
            return Response(serializer.data)


    @action(detail=False, url_path="liked_gifs", url_name="get_all_liked_gifs")
    def liked_gifs(self, request):
        serializer = self.get_serializer(request.user.likes.all(), many=True)
        return Response(serializer.data)


    @action(methods=["GET", "POST"], detail=False, url_path='likes', url_name="get_all_likes")
    def likes(self, request):
        if request.method == "POST": 
            gif = Gif.objects.get(pk=self.request.data['id'])
            if gif not in self.request.user.likes.all():
                self.request.user.likes.add(gif)
                gif.favourites += 1
                gif.save()
                return Response({'liked' : True})
            else:
                self.request.user.likes.remove(gif)
                gif.favourites -= 1
                gif.save()
                return Response({'liked' : False})
        else:
            qs = request.user.likes.values_list('id', flat=True)
            return Response(qs)


    def has_more_data(self, offset):
        return self.queryset.count() > int(offset)


    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]