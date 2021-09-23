from .models import Favourite
from routes.controller import get_node_graph

def list_favourites(user):

    node_graph = get_node_graph()

    result = []
    favourites = list(Favourite.objects.filter(user_id=user.id).values_list('node_id', flat=True))
    for node_id in favourites:
        result.append({"node_id": node_id, "name": node_graph[node_id]["name"], "coordinates": node_graph[node_id]["coordinates"]})
    return result

def add_favourite(user, node_id):

    node_graph = get_node_graph()

    if node_id not in node_graph or node_graph[node_id]["type"] == "Road":
        return 1
        
    entry, created = Favourite.objects.get_or_create(user_id=user.id, node_id=node_id)
    if not created:
        return 2 # duplicate entry
    
    return 0 # ok

def remove_favourite(user, node_id):

    node_graph = get_node_graph()

    if int(node_id) not in node_graph:
        return 1

    num_deleted, details = Favourite.objects.filter(user_id=user.id, node_id=node_id).delete()
    if num_deleted == 0:
        return 2 # favourite did not exist
    
    return 0 # ok

