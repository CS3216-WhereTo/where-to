from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def list_nodes(request):
    return JsonResponse({}, content_type='application/json')

def find_nearest_node(request):
    return JsonResponse({}, content_type='application/json')
