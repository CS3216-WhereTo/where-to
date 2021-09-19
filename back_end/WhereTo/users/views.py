from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse

from utils.decorators import authenticated, extract_body
from users import controller

# Create your views here.
@require_GET
@extract_body
@authenticated
def get_speed(request, user_id):
    result = controller.get_speed(user_id)
    return JsonResponse({'speed': result}, content_type='application/json')

@require_POST
@extract_body
@authenticated
def update_speed(request, body, user_id):
    result = controller.update_speed(user_id, body['speed'])
    return JsonResponse({'error': result}, content_type='application/json')

@require_GET
@extract_body
@authenticated
def list_recents(request, user_id):
    result = controller.list_recents(user_id)
    return JsonResponse({'routes': result}, content_type='application/json')
