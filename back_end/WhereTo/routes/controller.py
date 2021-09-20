from .routing_helper import *
from .models import WalkEdge, BusEdge, BusService
from nodes.models import Node, BusStop, Landmark, Road
from django.contrib.sessions.backends.db import SessionStore
import polyline


# Information regarding each node (bus stops, landmarks, roads)
# Key - node_id: int
# Values - "name": str, "type": str, "coordinates": [lat: float, lon: float] "neighbors": [int, ]

def get_node_graph():
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


# Additional information regarding each bus stop
# Key - bus_stop_id: int
# Values - "bus_neighbors": [int], "stop_duration": int

def get_bus_stop_graph():
    bus_stop_graph = {}

    bus_stops = list(BusStop.objects.values_list())
    for node, stop_duration in bus_stops:
        bus_stop_graph[node] = {"stop_duration": stop_duration}
    
    bus_edges = list(BusEdge.objects.values_list())
    for id, start, end, duration, polyline in bus_edges:
        if end not in bus_stop_graph[start]["bus_neighbors"]:
            bus_stop_graph[start]["bus_neighbors"].append(end)

    return bus_stop_graph


# Travelling information between adjacent bus stops
# Key - (start_id: int, end_id: int)
# Values - "duration": int, "services": [str, ], "polyline": str

def get_bus_route_edges():
    bus_route_edges = {}

    bus_edges = list(BusEdge.objects.values_list())
    for id, start, end, duration, polyline in bus_edges:
        bus_route_edges[(start, end)] = {"duration": duration, "polyline": polyline, "services": []}
    
    bus_services = list(BusService.object.values_list())
    for id, edge, service in bus_services:
        start, end = bus_edges.objects.get(id = edge).start, bus_edges.objects.get(id = edge).end
        if service not in bus_route_edges[(start, end)]["services"]:
            bus_route_edges[(start, end)]["services"].append(service)
    
    return bus_route_edges


def get_walk_route(origin_id, destination_id):
    
    session = SessionStore()
    if "node_graph" not in session:
        session["node_graph"] = get_node_graph()
    
    node_graph = session["node_graph"]

    walk_speed = get_walk_speed()
    time_to, pred = dijkstra_walk(origin_id, destination_id, node_graph, walk_speed)

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
    

def get_bus_route(origin_id, destination_id):
    pass


def get_combined_route(origin_id, destination_id):
    return get_walk_route(origin_id, destination_id), get_bus_route(origin_id, destination_id)


def read_test_data():
    import csv
    node_graph, bus_stop_graph, bus_route_edges = {}, {}, {}
    with open("test_data/nodedata.csv") as f:
        data = csv.reader(f)
        next(data)
        for node_id, node_name, node_lat, node_lon, node_type, node_neighbors in data:
            if node_type == "Bus Stop":
                node_name = node_name + " Bus Stop"
            node_id, node_lat, node_lon =  int(node_id), float(node_lat), float(node_lon)
            neighbors = list(map(lambda x: int(x), node_neighbors.split("/")))
            curr = {"name":node_name, "type": node_type, "coordinates": (node_lat, node_lon) , "neighbors": neighbors}
            node_graph[node_id] = curr

    with open("test_data/stopdata.csv") as f:
        data = csv.reader(f)
        next(data)
        for stop_id, stop_name, stop_duration, stop_lat, stop_lon in data:
            stop_id, stop_duration=  int(stop_id), int(stop_duration)
            curr = {"stop_duration": stop_duration, "bus_neighbors":[]}
            bus_stop_graph[stop_id] = curr

    with open("test_data/routedata.csv") as f:
        data = csv.reader(f)
        next(data)
        for start_name, start_id, end_name, end_id, duration, services, route_coordinates in data:
            start_id, end_id, duration, services, route_coordinates = int(start_id), int(end_id), int(duration), services.split(), route_coordinates.split()
            plot_coordinates = []
            for coordinate in route_coordinates:
                plot_coordinates.append(list(map(lambda x: float(x), coordinate.split("/"))))
            bus_stop_graph[start_id]["bus_neighbors"].append(end_id)
            curr = {"duration": duration, "services": services, "polyline": polyline.encode(plot_coordinates)}
            bus_route_edges[(start_id, end_id)] = curr

#read_test_data()
#print(node_graph)
#print(bus_stop_graph)
#print(bus_route_edges)
#print(get_walk_route(100, 616))
