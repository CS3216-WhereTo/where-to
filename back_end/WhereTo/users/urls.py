from django.urls import path

from . import views

urlpatterns = [
    path('update_speed', views.update_speed),
    path('list_recents', views.list_recents),
]
