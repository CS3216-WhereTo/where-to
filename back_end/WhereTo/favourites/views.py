from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from utils.decorators import authenticated, extract_body
from utils.error_responses import BAD_REQUEST
from . import controller

# Create your views here.
@require_GET
@authenticated()
def list_favourites(request, user):
    result = controller.list_favorites(user)
    return JsonResponse({'nodes': result}, content_type='application/json')

@require_POST
@extract_body('node_id')
@authenticated()
def add_favourite(request, node_id, user):
    result = controller.add_favorite(user, node_id)
    return JsonResponse({'error': result}, content_type='application/json')

@require_POST
@extract_body('node_id')
@authenticated()
def remove_favourite(request, node_id, user):
    result = controller.remove_favorite(user, node_id)
    return JsonResponse({'error': result}, content_type='application/json')
