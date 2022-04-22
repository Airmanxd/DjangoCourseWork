from .models import Gif
from rest_framework import parsers, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, authentication_classes
from .serializers import GifSerializer


class GifViewSet(viewsets.ModelViewSet):
    queryset = Gif.objects.all()
    serializer_class = GifSerializer
    parser_classes = [parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {'list' : [permissions.AllowAny],
                                    'tags' : [permissions.AllowAny]}
    

    def perform_create(self, serializer):
        serializer.validated_data['uploader'] = self.request.user
        for tag in serializer.validated_data['tags']:
            if not tag.isalnum() and not tag == "":
                return Response(status=400, data={'tags' : "You can only use letters and numbers in tags!"})
        return super().perform_create(serializer)

    def perform_destroy(self, instance):
        if instance.uploader == self.request.user:
            return super().perform_destroy(instance)
        else:
            return Response(status=401)

    @action(detail=False, url_path='tags', url_name="get_all_tags")
    def tags(self, request):
        data = Gif.objects.values_list('tags', flat=True)
        res = set()
        for val in data:
            res.update(val)
        return Response(res)

    """
    The get method to get all the gifs that also filters it based on tags
    "Liked" and "My gifs" are special tags for user's likes and uploads respectively
    """
    def list(self, request, *args, **kwargs):
        query_params = request.query_params.copy()
        qs = self.get_queryset()
        offset = query_params.get('offset')
        if 'tag' in query_params.keys():
            tags = query_params.pop('tag')
            if 'Liked' in tags:
                tags.remove('Liked')
                if self.request.user.is_authenticated:
                    qs=self.request.user.liked.all()
                else:
                    return Response(status=401)
            if 'My gifs' in tags:
                tags.remove('My gifs')
                if self.request.user.is_authenticated:
                    qs=self.request.user.uploads.all()
                else:
                    return Response(status=401)
            qs = self.filter_qs(qs, tags)
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page, many=True)
        return Response({"gifs" : serializer.data,
                        "hasMore" : self.has_more_data(offset)})

    """
    on get returns the of ids of all liked gifs
    on post likes or dislikes a gif
    """
    @action(methods=["GET", "POST"], detail=False, url_path='likes', url_name="get_all_likes")
    def likes(self, request):
        if request.method == "POST": 
            gif = Gif.objects.get(pk=self.request.data['id'])
            if gif not in self.request.user.liked.all():
                self.request.user.liked.add(gif)
                gif.likes += 1
                gif.save()
                return Response({'liked' : True})
            else:
                self.request.user.liked.remove(gif)
                gif.likes -= 1
                gif.save()
                return Response({'liked' : False})
        else:
            qs = request.user.liked.values_list('id', flat=True)
            return Response(qs)


    #filters the query based on given tags
    def filter_qs(self, qs, tags):
        for tag in tags:
            qs = qs.filter(tags__icontains=tag)
        return qs


    #Returns true is there are more pages to show
    def has_more_data(self, offset):
        return self.queryset.count() > int(offset)

    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]