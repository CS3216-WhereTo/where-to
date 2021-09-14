import math
from pqdict import minpq


DEFAULT_WALK_SPEED = 1.4


def get_distance(p, q):
    """Calculates Haversine distance between coordinates p and q

    Parameters:
        p (tuple): Coordinate in (lat,lon) format
        q (tuple): Coordinate in (lat,lon) format

    Returns:
        float: Haversine distance (in meters)
    """
    lat1, lon1 = math.radians(p[0]), math.radians(p[1])
    lat2, lon2 = math.radians(q[0]), math.radians(q[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    return round(6371000 * c)


def get_walk_duration_from_distance(distance, walk_speed):
    return round(distance / walk_speed)


def get_distance_from_walk_duration(duration, walk_speed):
    return round(duration * walk_speed)


def get_walk_speed():
    return DEFAULT_WALK_SPEED


def get_bus_arrival_duration(bus_number):
    import random
    return random.randint(1, 10)


def dijkstra_walk(origin_id, destination_id, node_graph, walk_speed):

    # Check for input validity
    if origin_id == destination_id:
        raise Exception("Error: origin is same as destination")
    if origin_id not in node_graph:
        raise Exception("Error: origin not in graph")
    if destination_id not in node_graph:
        raise Exception("Error: destination not in graph")
    
    time_to_destination = None
    # Predecessor of given node
    pred = {}
    # Main priority queue for Dijkstra
    pq = minpq()

    # Initialize value for Dijkstra algorithm
    pq[origin_id] = 0

    # Main loop to compute shortest distance
    while len(pq) > 0:

        # Remove item from front of queue
        node_id, time_to_node = pq.popitem()
        node_coordinates = node_graph[node_id]['coordinates']
        
        # Check if destination has been reached
        if node_id == destination_id:
            time_to_destination = time_to_node
            break

        # Iterate through neighbors and relax edges
        for neighbor_id in node_graph[node_id]['neighbors']:
            neighbor_coordinates = node_graph[neighbor_id]['coordinates']
            distance_apart = get_distance(node_coordinates, neighbor_coordinates)
            duration_apart = get_walk_duration_from_distance(distance_apart, walk_speed)
            new_time_to_neighbor = time_to_node + duration_apart
            
            # Check if relaxation possible
            if neighbor_id in pq and pq[neighbor_id] <= new_time_to_neighbor:
                continue
            
            # Update pq directly, ensures no duplicate copies of the same node present in pq
            pq[neighbor_id] = new_time_to_neighbor
            pred[neighbor_id] = node_id
        
    if time_to_destination == None:
        raise Exception("Error: no path found from origin to destination")
    
    return time_to_destination, pred


testing_node_graph = {}


        
    


    


