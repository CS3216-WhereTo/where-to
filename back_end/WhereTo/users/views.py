from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse

from utils.decorators import authenticated, extract_body
from . import controller

# Create your views here.
@require_GET
@authenticated(required=True)
def get_speed(request, user):
    result = controller.get_speed(user)
    return JsonResponse({'speed': result}, content_type='application/json')

@require_POST
@extract_body('speed')
@authenticated()
def update_speed(request, speed, user):
    result = controller.update_speed(user, speed)
    return JsonResponse({'error': result}, content_type='application/json')

@require_GET
@authenticated()
def list_recents(request, user):
    result = controller.list_recents(user)
    return JsonResponse({'routes': result}, content_type='application/json')

@require_GET
@authenticated(required=False)
def check_token(request, user):
    result = controller.check_user(user)
    return JsonResponse({'valid': result}, content_type='application/json')
