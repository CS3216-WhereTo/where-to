from django.http import JsonResponse
from WhereTo.secrets import GOOGLE_CLIENT_ID
from .auth import authenticated
import json

# Create your views here.
@authenticated
def update_speed(request, user_id):
    body = json.loads(request.body)

    # placeholders to try out authentication
    return JsonResponse({'client': GOOGLE_CLIENT_ID, 'req': body, 'result': user_id}, content_type='application/json')

@authenticated
def list_recents(request, user_id):
    return JsonResponse({}, content_type='application/json')