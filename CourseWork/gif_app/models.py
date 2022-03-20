from unicodedata import category
from django.db import models
from django.conf import settings

# Create your models here.
class Gif(models.Model):
    name = models.CharField(max_length=30, unique=True)
    favourites = models.IntegerField(default=0)
    categories = models.JSONField(null=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    file = models.ImageField()
