from dataclasses import fields
from rest_framework import serializers
from .models import Gif
class GifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gif
        fields=['name', 'favourites', 'tags', 'creator', 'file']