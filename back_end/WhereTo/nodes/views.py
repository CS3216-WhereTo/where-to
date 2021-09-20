from django.http.response import JsonResponse
from django.views.decorators.http import require_GET

# Create your views here.
@require_GET
def list_nodes(request):
    return JsonResponse({}, content_type='application/json')

@require_GET
def find_nearest_node(request):
    return JsonResponse({}, content_type='application/json')
