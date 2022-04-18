from django.db import models
from django.conf import settings
# Create your models here.
class Gif(models.Model):
    name = models.CharField(max_length=30, unique=True)
    favourites = models.IntegerField(default=0, blank=True)
    tags = models.JSONField(null=True)
    uploader = models.CharField(max_length=30, null=True, blank=True)
    filepath = models.CharField(max_length=100, null=True, blank=True)
    users_liked = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="likes")
