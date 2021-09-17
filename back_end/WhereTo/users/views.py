from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests

# Create your views here.
def update_speed(request):
    return JsonResponse({}, content_type='application/json')
