from .models import Recent

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
    recents = recents[:MAX_RECENTS].values_list('route', flat=True).all()
    return recents

def add_recent(user, route):
    Recent(user_id=user.id, route=route).save()
