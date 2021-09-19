from django.http.response import JsonResponse
from django.views.decorators.http import require_GET

from users.auth import authenticated

# Create your views here.
@require_GET
@authenticated
def find_combined_route(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_GET
@authenticated
def find_walk_route(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_GET
@authenticated
def find_bus_route(request, user_id):
    return JsonResponse({}, content_type='application/json')
