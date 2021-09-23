import json

from .models import Recent

DEFAULT_WALK_SPEED = 1.4

def get_speed(user):
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
    recents = list(recents[:MAX_RECENTS].values('start_id', 'end_id', 'route'))
    for i in recents:
        i['route'] = json.loads(i['route'])
    return recents

def add_recent(user, start_id, end_id, route_json):
    route_str = json.dumps(route_json)
    Recent(user_id=user, start_id_id=start_id, end_id_id=end_id, route=route_str).save()

def check_user(user):
    return 0 if user is None else 1
