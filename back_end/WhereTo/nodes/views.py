from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from google import auth
from utils.decorators import authenticated, extract_body
from . import controller

# Create your views here.
@require_GET
@authenticated(required=False)
def list_nodes(request, user):
    favourites, non_favourites = controller.list_nodes(user)
    result = {
        "favourites": favourites,
        "non_favourites": non_favourites
    }
    return JsonResponse(result, content_type='application/json')   

@require_POST
@extract_body('coordinates')
def find_nearest_node(request, coordinates):
    result = controller.find_nearest_node(coordinates)
    return JsonResponse(result, content_type='application/json')
