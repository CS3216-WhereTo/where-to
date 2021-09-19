from .models import User, Recent
from routes.routing_helper import DEFAULT_WALK_SPEED

def get_user(fn):
    def wrapped_function(user_id, **kwargs):
        try:
            user = User.objects.get(google_id=user_id)
        except User.DoesNotExist:
            user = User(google_id=user_id, walking_speed=DEFAULT_WALK_SPEED)
            user.save()
        return fn(user, **kwargs)
    return wrapped_function

@get_user
def get_speed(user):
    return user.walking_speed

@get_user
def update_speed(user, speed):
    if speed <= 0:
        return 1
    
    user.walking_speed = speed
    user.save()
    return 0

MAX_RECENTS = 10

@get_user
def list_recents(user):
    recents = Recent.objects.filter(user_id=user).order_by('-access_time')
    recents = recents[:MAX_RECENTS].values_list('route', flat=True).all()
    return recents
