from django.urls import path

from . import views

urlpatterns = [
    path('list_favourites', views.list_favourites),
    path('add_favourite', views.add_favourite),
    path('remove_favourite', views.remove_favourite),
]
