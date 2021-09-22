from .routing_helper import *
from .models import WalkEdge, BusEdge, BusService
from nodes.models import Node, BusStop, Landmark, Road
from users.controller import get_speed, add_recent, DEFAULT_WALK_SPEED
from django.contrib.sessions.backends.db import SessionStore
import copy
import polyline


def get_node_graph():
    session = SessionStore()
    if "node_graph" not in session:
        session["node_graph"] = generate_node_graph()
    return session["node_graph"]


def generate_node_graph():
    # Information regarding each node (bus stops, landmarks, roads)
    # Key - node_id: int
    # Values - "name": str, "type": str, "coordinates": [lat: float, lon: float] "neighbors": [int, ]

    node_graph = {}

    nodes = list(Node.objects.values_list())
    for id, name, lat, lon in nodes:
        node_graph[id] = {"name": name, "coordinates": [lat, lon], "neighbors": []}
        if BusStop.objects.filter(node = id).exists():
            node_graph[id]["type"] = "Bus Stop"
        elif Landmark.objects.filter(node = id).exists():
            node_graph[id]["type"] = "Landmark"
        elif Road.objects.filter(node = id).exists():
            node_graph[id]["type"] = "Road"
        else:
            raise Exception("Node is neither bus stop, landmark nor road")
    
    walk_edges = list(WalkEdge.objects.values_list())
    for id, start, end in walk_edges:
        if end not in node_graph[start]["neighbors"]:
            node_graph[start]["neighbors"].append(end)
        if start not in node_graph[end]["neighbors"]:
            node_graph[end]["neighbors"].append(start)
    
    return node_graph


def get_bus_stop_graph():
    session = SessionStore()
    if "bus_stop_graph" not in session:
        session["bus_stop_graph"] = generate_bus_stop_graph()
    return session["bus_stop_graph"]


def generate_bus_stop_graph():
    # Additional information regarding each bus stop
    # Key - bus_stop_id: int
    # Values - "bus_neighbors": [int], "stop_duration": int

    bus_stop_graph = {}

    bus_stops = list(BusStop.objects.values_list())
    for node, stop_duration in bus_stops:
        bus_stop_graph[node] = {"stop_duration": stop_duration, "bus_neighbors":[]}
    
    bus_edges = list(BusEdge.objects.values_list())
    for id, start, end, duration, polyline in bus_edges:
        if end not in bus_stop_graph[start]["bus_neighbors"]:
            bus_stop_graph[start]["bus_neighbors"].append(end)

    return bus_stop_graph


def get_bus_route_edges():
    session = SessionStore()
    if "bus_route_edges" not in session:
        session["bus_route_edges"] = generate_bus_route_edges()
    return session["bus_route_edges"]


def generate_bus_route_edges():
    # Travelling information between adjacent bus stops
    # Key - (start_id: int, end_id: int)
    # Values - "duration": int, "services": [str, ], "polyline": str

    bus_route_edges = {}

    bus_edges = list(BusEdge.objects.values_list())
    for id, start, end, duration, polyline in bus_edges:
        bus_route_edges[(start, end)] = {"duration": duration, "polyline": polyline, "services": []}
    
    bus_services = list(BusService.objects.values_list())
    for id, edge, service in bus_services:
        start, end = BusEdge.objects.get(id = edge).start.node.id, BusEdge.objects.get(id = edge).end.node.id
        if service not in bus_route_edges[(start, end)]["services"]:
            bus_route_edges[(start, end)]["services"].append(service)
    
    return bus_route_edges


def get_walk_route(origin_id, destination_id, user):
    
    node_graph = get_node_graph()

    if user:
        walk_speed = get_speed(user)
    else:
        walk_speed = DEFAULT_WALK_SPEED

    time_to, pred = dijkstra_walk(origin_id, destination_id, walk_speed, node_graph)

    total_duration = time_to[destination_id]
    total_distance = get_distance_from_walk_duration(total_duration, walk_speed)
    
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

    return result
    

def get_bus_route(origin_id, destination_id, user):
    
    node_graph = get_node_graph()
    bus_stop_graph = get_bus_stop_graph()
    bus_route_edges = get_bus_route_edges()

    if user:
        walk_speed = get_speed(user)
    else:
        walk_speed = DEFAULT_WALK_SPEED

    time_to, pred, bus_waiting_times = dijkstra_bus(origin_id, destination_id, walk_speed, node_graph, bus_stop_graph, bus_route_edges)
    
    time_to_destination = dict(filter(lambda x:x[0][0] == destination_id, time_to.items()))

    min_time = float("inf")
    destination_transport_mode = None
    for transport_mode in time_to_destination:
        if time_to_destination[transport_mode] < min_time:
            destination_transport_mode = transport_mode
            min_time = time_to_destination[transport_mode]
    
    total_duration = min_time
    
    current = destination_transport_mode
    full_path = []
    full_path.append(current)
    while current[0] != origin_id:
        current = pred[current]
        full_path.append(current)
    
    full_path.reverse()

    split_path = []
    nodes = [full_path[0]]
    for i in range(1, len(full_path)):
        if i != 1 and full_path[i][1] != full_path[i-1][1]:
            transport_mode = full_path[i-1][1]
            split_path.append({
                "transport_mode": transport_mode,
                "nodes": nodes.copy()
            })
            nodes = [full_path[i-1]]
        nodes.append(full_path[i])
    transport_mode = full_path[-1][1]
    split_path.append({
        "transport_mode": transport_mode,
        "nodes": nodes.copy()
    })

    segments = []
    
    for current in split_path:

        if current["transport_mode"] == "walk":
            duration = time_to[current["nodes"][-1]] - time_to[current["nodes"][0]]
            distance = get_distance_from_walk_duration(duration, walk_speed)
            path = []
            polyline_coordinates = []

            for node in current["nodes"]:
                path.append({"name": node_graph[node[0]]["name"], "coordinates": node_graph[node[0]]["coordinates"]})
                polyline_coordinates.append(node_graph[node[0]]["coordinates"])

            segments.append({
                "transport_type": "walk",
                "duration": duration, 
                "distance": distance,
                "polyline": polyline.encode(polyline_coordinates),
                "path": copy.deepcopy(path)
            })
        
        else:
            bus_waiting_time = bus_waiting_times[(current["nodes"][0][0], current["transport_mode"], time_to[current["nodes"][0]])]
            duration = time_to[current["nodes"][-1]] - time_to[current["nodes"][0]] - bus_waiting_time
            services = {current["transport_mode"]: {"wait_time": bus_waiting_time}}
            path = []
            polyline_coordinates = []

            for i in range(len(current["nodes"])):
                path.append({"name": node_graph[current["nodes"][i][0]]["name"], "coordinates": node_graph[current["nodes"][i][0]]["coordinates"]})
                if i == 0:
                    continue
                elif i == 1:
                    polyline_coordinates.extend(polyline.decode(bus_route_edges[(current["nodes"][i-1][0], current["nodes"][i][0])]["polyline"]))
                else:
                    polyline_coordinates.extend(polyline.decode(bus_route_edges[(current["nodes"][i-1][0], current["nodes"][i][0])]["polyline"])[1:])
            
            current_path = list(map(lambda x:x[0], current["nodes"]))
            other_services = get_services_serving_path(current_path, bus_route_edges)
            for service in other_services:
                if service not in services:
                    if (current["nodes"][0][0], service, time_to[current["nodes"][0]]) in bus_waiting_times:
                        bus_waiting_time = bus_waiting_times[(current["nodes"][0][0], service, time_to[current["nodes"][0]])]
                    else: 
                        bus_waiting_time = get_bus_waiting_time(current["nodes"][0][0], service, time_to[current["nodes"][0]])
                services[service] = {"wait_time": bus_waiting_time}

            segments.append({
                "transport_type": "bus",
                "duration": duration, 
                "services": services,
                "polyline": polyline.encode(polyline_coordinates),
                "path": copy.deepcopy(path)
            })
    
    result =  {
        "total_duration": total_duration,
        "segments": segments
    }
    
    return result
    

def get_route(origin_id, destination_id, user):
    result = {
        "walk": get_walk_route(origin_id, destination_id, user),
        "bus": get_bus_route(origin_id, destination_id, user)
    }
    if user:
        add_recent(user, origin_id, destination_id, result)
    
    return result