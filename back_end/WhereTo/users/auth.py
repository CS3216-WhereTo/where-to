from django.http.response import HttpResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from WhereTo.secrets import GOOGLE_CLIENT_ID
import json

# decorator for custom authentication middleware
def authenticated(handler):
    def wrapped_handler(request):
        body = json.loads(request.body)
        token = body['token']
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            user_id = id_info['sub']

            return wrapped_handler(request, user_id)
        except ValueError:
            # Invalid token
            return HttpResponse(status=401)

    return wrapped_handler