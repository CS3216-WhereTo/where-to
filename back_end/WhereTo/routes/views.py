from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from utils.decorators import authenticated, extract_body
from .controller import get_route, get_walk_route, get_bus_route

# Create your views here.
@require_POST
@extract_body('start_id', 'end_id')
@authenticated(required=False)
def find_route(request, start_id, end_id, user):
    result = get_route(start_id, end_id, user)
    return JsonResponse(result, content_type='application/json')


@require_POST
@extract_body('start_id', 'end_id')
@authenticated(required=False)
def find_walk_route(request, start_id, end_id, user):
    result = get_walk_route(start_id, end_id, user)
    return JsonResponse(result, content_type='application/json')


@require_POST
@extract_body('start_id', 'end_id')
@authenticated(required=False)
def find_bus_route(request, start_id, end_id, user):
    result = get_bus_route(start_id, end_id, user)
    return JsonResponse(result, content_type='application/json')
