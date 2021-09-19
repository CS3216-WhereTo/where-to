from django.http.response import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests
import json

from WhereTo.secrets import GOOGLE_CLIENT_ID
from users.models import User
from routes.routing_helper import DEFAULT_WALK_SPEED

# decorator to extract parameters from JSON body
def extract_body(handler):
    def wrapped_handler(request, **kwargs):
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(status=400)
        
        kwargs['body'] = body

        return handler(request, **kwargs)
    
    return wrapped_handler

# helper for authenticated decorator
def get_user(user_id):
    try:
        user = User.objects.get(google_id=user_id)
    except User.DoesNotExist:
        user = User(google_id=user_id, walking_speed=DEFAULT_WALK_SPEED)
        user.save()
    return user

# decorator for custom authentication middleware. requires extract_body beforehand
def authenticated(handler):
    def wrapped_handler(request, **kwargs):
        token = kwargs['body']['token']
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            user_id = id_info['sub']
        except ValueError:
            # Invalid token
            return JsonResponse(status=401)

        kwargs['user'] = get_user(user_id)
        
        return handler(request, **kwargs)

    return wrapped_handler
