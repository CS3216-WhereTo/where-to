from django.http.response import JsonResponse
from django.views.decorators.http import require_GET
import json

from utils.decorators import authenticated, extract_body
from .routing import get_combined_route, get_walk_route, get_bus_route

def extract_node_ids(body):
    return body['start_id'], body['end_id']

# Create your views here.
@require_GET
@extract_body
@authenticated
def find_combined_route(request, body, user_id):
    node_ids = extract_node_ids(body)
    walk, bus = get_combined_route(*node_ids)
    result = {
        'walk': walk,
        'bus': bus,
    }
    return JsonResponse(json.dumps(result), content_type='application/json')

@require_GET
@authenticated
def find_walk_route(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_GET
@authenticated
def find_bus_route(request, user_id):
    return JsonResponse({}, content_type='application/json')
