from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from utils.decorators import authenticated, extract_body
from utils.error_responses import BAD_REQUEST
from . import controller

# Create your views here.
@require_GET
@authenticated
def list_favourites(request, user):
    result = controller.list_favorites(user)
    return JsonResponse({'nodes': result}, content_type='application/json')

@require_POST
@extract_body
@authenticated
def add_favourite(request, body, user):
    if 'node_id' not in body:
        return BAD_REQUEST

    result = controller.add_favorite(user, body['node_id'])
    return JsonResponse({'error': result}, content_type='application/json')

@require_POST
@extract_body
@authenticated
def remove_favourite(request, body, user):
    if 'node_id' not in body:
        return BAD_REQUEST

    result = controller.remove_favorite(user, body['node_id'])
    return JsonResponse({'error': result}, content_type='application/json')
