from . import views
from django.urls import path

urlpatterns = [
    path('', views.GifCreateAPIView.as_view(), name='create'),
    path('/<int:pk>/', views.GifReadAPIView.as_view(), name='getByID'),
    path('/<int:pk>/', views.GifDeleteAPIView.as_view(), name='deleteByID')
]
