from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from utils.decorators import authenticated, extract_body
from .controller import get_combined_route, get_walk_route, get_bus_route

def extract_node_ids(body):
    return body['start_id'], body['end_id']

# Create your views here.
@require_POST
@extract_body
@authenticated
def find_combined_route(request, body, user):
    node_ids = extract_node_ids(body)
    walk, bus = get_combined_route(*node_ids)
    result = {
        'walk': walk,
        'bus': bus,
    }
    return JsonResponse(result, content_type='application/json')

@require_POST
@extract_body
def find_walk_route(request, body):
    node_ids = extract_node_ids(body)
    result = get_walk_route(*node_ids)
    return JsonResponse(result, content_type='application/json')

@require_GET
@extract_body
def find_bus_route(request, body):
    node_ids = extract_node_ids(body)
    result = get_bus_route(*node_ids)
    return JsonResponse(result, content_type='application/json')
