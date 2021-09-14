from routing_helper import *
import polyline
import json

# Information regarding each node (bus stops, landmarks, roads)
# Key - node_id: int
# Values - "name": str, "type": str, "coordinates": [lat: float, lon: float] "neighbors": [int, ]
node_graph = {}

# Additional information regarding each bus stop
# Key - bus_stop_id: int
# Values - "bus_neighbors": [int], "stop_duration": int
bus_stop_graph = {}

# Travelling information between adjacent bus stops
# Key - (start_id: int, end_id: int)
# Values - "duration": int, "services": [str, ], "polyline": str
bus_route_edges = {}


def get_walk_route(origin_id, destination_id):
    
    walk_speed = get_walk_speed()
    time_to_destination, pred = dijkstra_walk(origin_id, destination_id, node_graph, walk_speed)
    
    total_duration = time_to_destination
    total_distance = get_distance_from_walk_duration
    
    current_id = destination_id
    path = [{"name": node_graph[current_id]["name"], "coordinates": node_graph[current_id]["coordinates"]}]
    polyline_coordinates = [node_graph[current_id]["coordinates"]]
    
    while current_id != origin_id:
        current_id = pred[current_id]
        path.append({"name": node_graph[current_id]["name"], "coordinates": node_graph[current_id]["coordinates"]})
        polyline_coordinates.append(node_graph[current_id]["coordinates"])
    
    path.reverse()
    polyline_coordinates.reverse()

    result = {
        "total_duration": total_duration,
        "total_distance": total_distance,
        "polyline": polyline.encode(polyline_coordinates),
        "path": path
    }

    return json.dumps(result)
    
