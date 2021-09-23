import json

from .models import Recent
from routes.controller import get_node_graph

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
    recents = list(recents.values('start_id', 'end_id', 'route')[:MAX_RECENTS])
    
    node_graph = get_node_graph()
    
    for recent in recents:
        start_id, end_id = recent["start_id"], recent["end_id"]
        recent["start_node"] = {"node_id": start_id, "name": node_graph[start_id]["name"], "coordinates": node_graph[start_id]["coordinates"]}
        recent["end_node"] = {"node_id": start_id, "name": node_graph[end_id]["name"], "coordinates": node_graph[end_id]["coordinates"]}
        recent['route'] = json.loads(recent['route'])
        del recents["start_id"]
        del recents["end_id"]
    return recents

def add_recent(user, start_id, end_id, route_json):
    route_str = json.dumps(route_json)
    Recent(user_id=user, start_id_id=start_id, end_id_id=end_id, route=route_str).save()

def check_user(user):
    return 0 if user is None else 1
