from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from users.auth import authenticated

# Create your views here.
@require_GET
@authenticated
def list_favourites(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_POST
@authenticated
def add_favourite(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_POST
@authenticated
def remove_favourite(request, user_id):
    return JsonResponse({}, content_type='application/json')
