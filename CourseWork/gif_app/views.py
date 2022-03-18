from django.shortcuts import render
from django.http import HttpResponse
from models import Gif
from pathlib import Path
from django.core.files.storage import default_storage
# Create your views here.

def add_gif(request):
    if request.method=='POST':
        data = request.POST.dict()
        upload = request.FILES['file']
        upload.name = default_storage.save({data['name']}.gif, upload)
        temp = Gif(name=upload.name[:-4], favourites=0, file=upload, creator=request.user)