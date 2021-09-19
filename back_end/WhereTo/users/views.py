from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
import json

from utils.decorators import authenticated
from WhereTo.secrets import GOOGLE_CLIENT_ID

# Create your views here.
@require_GET
@authenticated
def get_speed(request, user_id):
    return JsonResponse({}, content_type='application/json')

@require_POST
@authenticated
def update_speed(request, user_id):
    body = json.loads(request.body)

    # placeholders to try out authentication
    return JsonResponse({'client': GOOGLE_CLIENT_ID, 'req': body, 'result': user_id}, content_type='application/json')

@require_GET
@authenticated
def list_recents(request, user_id):
    return JsonResponse({}, content_type='application/json')
