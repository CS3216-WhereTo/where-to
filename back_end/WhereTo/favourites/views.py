from users.auth import authenticated
from django.http.response import JsonResponse

# Create your views here.
@authenticated
def list_favourites(request, user_id):
    return JsonResponse({}, content_type='application/json')

@authenticated
def add_favourite(request, user_id):
    return JsonResponse({}, content_type='application/json')

@authenticated
def remove_favourite(request, user_id):
    return JsonResponse({}, content_type='application/json')

