from django.http.response import JsonResponse

UNAUTHORIZED = JsonResponse({}, status=401)
BAD_REQUEST = JsonResponse({}, status=400)
