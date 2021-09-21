from .models import Recent

DEFAULT_WALK_SPEED = 1.4

def get_speed(user):
    if not user.is_authenticated():
        return DEFAULT_WALK_SPEED
    return user.walking_speed

def update_speed(user, speed):
    if speed <= 0:
        return 1
    
    user.walking_speed = speed
    user.save()
    return 0

MAX_RECENTS = 10

def list_recents(user):
    recents = Recent.objects.filter(user_id=user).order_by('-access_time')
    recents = recents[:MAX_RECENTS].values_list('route', flat=True).all()
    return recents

def add_recent(user, start_id, end_id, route_json):
    #todo: update model schema
    Recent(user_id=user.id, route=route_json).save()

def check_user(user):
    return 0 if user is None else 1
