from django.contrib.sessions.backends.db import SessionStore
from .models import WalkEdge, BusEdge, BusService
from nodes.models import Node, BusStop, Landmark, Road


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