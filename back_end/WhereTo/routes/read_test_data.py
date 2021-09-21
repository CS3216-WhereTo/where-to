#unused

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
    
    return node_graph, bus_stop_graph, bus_route_edges