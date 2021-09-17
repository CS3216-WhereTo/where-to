from users.auth import authenticated
from django.http import JsonResponse

# Create your views here.
@authenticated
def find_combined_route(request, user_id):
    return JsonResponse({}, content_type='application/json')

@authenticated
def find_walk_route(request, user_id):
    return JsonResponse({}, content_type='application/json')

@authenticated
def find_bus_route(request, user_id):
    return JsonResponse({}, content_type='application/json')
