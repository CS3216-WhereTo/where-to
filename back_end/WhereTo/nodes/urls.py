from django.urls import path

from . import views

urlpatterns = [
    path('list_nodes', views.list_nodes),
    path('find_nearest_node', views.find_nearest_node)
]