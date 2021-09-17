from django.http import JsonResponse

# Create your views here.
def update_speed(request):
    return JsonResponse({}, content_type='application/json')
