from django.urls import path

from . import views

urlpatterns = [
    path('get_speed', views.get_speed),
    path('update_speed', views.update_speed),
    path('list_recents', views.list_recents),
]
