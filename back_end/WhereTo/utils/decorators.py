from google.oauth2 import id_token
from google.auth.transport import requests
import json

from WhereTo.secrets import GOOGLE_CLIENT_ID
from .error_responses import UNAUTHORIZED, BAD_REQUEST
from users.models import User
from routes.routing_helper import DEFAULT_WALK_SPEED

# decorator to extract parameters from JSON body
def extract_body(handler):
    def wrapped_handler(request, **kwargs):
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return BAD_REQUEST

        return handler(request, body=body, **kwargs)
    
    return wrapped_handler

# helper for authenticated decorator
def get_user(token):
    user_id = verify_user(token)
    if user_id is None:
        return None
    
    return get_user_model(user_id)

def verify_user(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        user_id = id_info['sub']
    except (KeyError, ValueError):
        # Invalid/missing token
        return None
    
    return user_id

def get_user_model(user_id):
    try:
        user = User.objects.get(google_id=user_id)
    except User.DoesNotExist:
        user = User(google_id=user_id, walking_speed=DEFAULT_WALK_SPEED)
        user.save()
    return user

# decorator for custom authentication middleware. requires extract_body beforehand
def authenticated(required=True):
    def decorator(handler):
        def wrapped_handler(request, body, **kwargs):
            user = get_user(body['token']) if 'token' in body else None

            if user is None and required:
                return UNAUTHORIZED
            
            return handler(request, user=user, **kwargs)

        return wrapped_handler
    return decorator
