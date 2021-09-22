from favourites.controller import list_favourites
from routes.controller import get_node_graph
from routes.routing_helper import get_distance

def list_nodes(user):

    node_graph = get_node_graph()

    if user:
        favourites = list_favourites(user)
    else:
        favourites = []

    fav_node_ids = list(map(lambda x: x["node_id"], favourites))
    non_favourites = []

    for node_id in node_graph:
        if node_graph[node_id]["type"] != "Road" and node_id not in fav_node_ids:
            non_favourites.append({"node_id": node_id, "name": node_graph[node_id]["name"], "coordinates": node_graph[node_id]["coordinates"]})
    
    return favourites, non_favourites

def find_nearest_node(coordinates):

    node_graph = get_node_graph()

    min_dist_node_id = None
    min_dist = float("inf")
    for node_id in node_graph:
        if node_graph[node_id]["type"] != "Road":
            distance = get_distance(coordinates, node_graph[node_id]["coordinates"])
            if distance < min_dist:
                min_dist = distance
                min_dist_node_id = node_id
    
    return {"node_id": min_dist_node_id, "name": node_graph[min_dist_node_id]["name"], "coordinates": node_graph[min_dist_node_id]["coordinates"]}