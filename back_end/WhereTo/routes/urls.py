from django.urls import path

from . import views

urlpatterns = [
    path('find_route', views.find_combined_route),
    path('find_walk_route', views.find_walk_route),
    path('find_bus_route', views.find_bus_route),
]
