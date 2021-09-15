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


def get_bus_waiting_time(bus_number, bus_stop_id):
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
    
    # Time taken to travel to given node
    time_to = {}
    # Predecessor of given node
    pred = {}
    # Main priority queue for Dijkstra
    pq = minpq()

    # Initialize value for Dijkstra algorithm
    for node_id in node_graph:
        time_to[node_id] = float("inf")
    time_to[origin_id] = 0
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

            if neighbor_id == node_id:
                continue
            
            neighbor_coordinates = node_graph[neighbor_id]['coordinates']
            distance_apart = get_distance(node_coordinates, neighbor_coordinates)
            travel_time = get_walk_duration_from_distance(distance_apart, walk_speed)
            new_time_to_neighbor = time_to_node + travel_time
            
            # Check if relaxation possible
            if time_to[neighbor_id] <= new_time_to_neighbor:
                continue
            
            # Update pq directly, ensures no duplicate copies of the same node present in pq
            time_to[neighbor_id] = new_time_to_neighbor
            pq[neighbor_id] = new_time_to_neighbor
            pred[neighbor_id] = node_id
        
    if time_to[destination_id] == float("inf"):
        raise Exception("Error: no path found from origin to destination")
    
    return time_to, pred


def dijkstra_bus(origin_id, destination_id, node_graph, bus_stop_graph, bus_route_edges, walk_speed):

    # Check for input validity
    if origin_id == destination_id:
        raise Exception("Error: origin is same as destination")
    if origin_id not in node_graph:
        raise Exception("Error: origin not in graph")
    if destination_id not in node_graph:
        raise Exception("Error: destination not in graph")

    # Keep track of bus arrival timings to avoid multiple calls to NextBus API
    bus_waiting_times = {}
    
    target_time_to_destination = None
    # Main priority queue for Dijkstra
    pq = minpq()

    # Initialize value for Dijkstra algorithm
    # Key for pq is (node_id, transport_mode), where transport mode is either "walk" or shuttle bus number (e.g. "A1")
    pq[(origin_id, "walk")] = 0

    # Main loop to compute shortest distance
    while len(pq) > 0:

        # Remove item from front of queue
        (node_id, transport_mode), time_to_node = pq.popitem()
        node_coordinates = node_graph[node_id]['coordinates']
        
        # Check if destination has been reached
        if node_id == destination_id:
            target_time_to_destination = time_to_node
            break

        # Iterate through (walk) neighbors and relax edges
        for neighbor_id in node_graph[node_id]['neighbors']:
            neighbor_coordinates = node_graph[neighbor_id]['coordinates']
            distance_apart = get_distance(node_coordinates, neighbor_coordinates)
            travel_time = get_walk_duration_from_distance(distance_apart, walk_speed)
            new_time_to_neighbor = time_to_node + travel_time
            
            # Check if relaxation possible
            if (neighbor_id, "walk") in pq and pq[(neighbor_id, "walk")] <= new_time_to_neighbor:
                continue
            
            # Update pq directly, ensures no duplicate copies of the same node present in pq
            pq[neighbor_id] = new_time_to_neighbor
        
        # Check if node is a bus stop
        if node_id not in bus_stop_graph:
            continue

        # Iternate through bus neighbors and relax edges
        for bus_neighbor_id in bus_stop_graph[node_id]["bus_neighbors"]:

            travel_time = bus_route_edges[(node_id, bus_neighbor_id)]["duration"]

            # Iterate through each service that can get from node to bus_neighbor
            for service in bus_route_edges[(node_id, bus_neighbor_id)]["services"]:
            
                # If do not need to change bus
                if transport_mode == service:
                    bus_stopping_time = bus_stop_graph[node_id]["stop_duration"]
                    new_time_to_bus_neighbor = time_to_node + bus_stopping_time + travel_time
                
                    # Check if relaxation possible
                    if (neighbor_id, transport_mode) in pq and pq[(neighbor_id, transport_mode)] <= new_time_to_bus_neighbor:
                        continue

                    # Update pq directly, ensures no duplicate copies of the same node present in pq
                    pq[(neighbor_id, transport_mode)] = new_time_to_bus_neighbor
                
                # If need to change bus
                else:

                    # If bus arrival timing has previously been queried
                    if bus_neighbor_id in bus_waiting_times and service in bus_waiting_times[bus_neighbor_id]:
                        bus_waiting_time = bus_waiting_times[bus_neighbor_id][service]

                    # If bus arrival timing has not been queried
                    else:
                        bus_waiting_time = get_bus_waiting_time(service, bus_neighbor_id)
                        if bus_neighbor_id not in bus_waiting_times:
                            bus_waiting_times[bus_neighbor_id] = {}
                        bus_waiting_times[bus_neighbor_id][service] = bus_waiting_time
                   
                    new_time_to_bus_neighbor = time_to_node + bus_waiting_time + travel_time

                    # Check if relaxation possible
                    if (neighbor_id, service) in pq and pq[(neighbor_id, service)] <= new_time_to_bus_neighbor:
                        continue

                    # Update pq directly, ensures no duplicate copies of the same node present in pq
                    pq[(neighbor_id, service)] = new_time_to_bus_neighbor
    
    if target_time_to_destination == None:
        raise Exception("Error: no path found from origin to destination")
    
    return target_time_to_destination







        
    


    


