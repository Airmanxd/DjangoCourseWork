from django.db import models
from django.conf import settings
# Create your models here.
class Gif(models.Model):
    name = models.CharField(max_length=30, unique=True)
    likes = models.IntegerField(default=0, blank=True)
    tags = models.JSONField(null=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="uploads")
    file = models.ImageField()
    users_liked = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="liked")
