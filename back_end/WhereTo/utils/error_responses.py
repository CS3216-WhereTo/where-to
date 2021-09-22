from django.http.response import HttpResponse

UNAUTHORIZED = HttpResponse(status=401)
BAD_REQUEST = HttpResponse(status=400)
