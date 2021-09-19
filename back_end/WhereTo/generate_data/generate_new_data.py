import csv
import polyline

def generate_node_csv():

    data = []

    with open("raw_data/nodedata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for node_id, node_name, node_lat, node_lon, node_type, node_neighbors in reader:
            if node_type == "Bus Stop":
                data.append([node_id, node_name + " Bus Stop", node_lat, node_lon])
            else:
                data.append([node_id, node_name, node_lat, node_lon])

    fields = ["node_id", "name", "lat", "lon"]

    with open("node.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data)


def generate_landmark_csv():
    data = []

    with open("raw_data/nodedata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for node_id, node_name, node_lat, node_lon, node_type, node_neighbors in reader:
            if node_type == "Building":
                data.append([node_id])

    fields = ["node_id"]

    with open("landmark.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data)


def generate_bus_stop_csv():
    data = []

    with open("raw_data/stopdata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for stop_id, stop_name, stop_duration, stop_lat, stop_lon in reader:
            data.append([stop_id, stop_duration])

    fields = ["node_id", "stop_duration"]

    with open("bus_stop.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data)


def generate_road_csv():
    data = []

    with open("raw_data/nodedata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for node_id, node_name, node_lat, node_lon, node_type, node_neighbors in reader:
            if node_type == "Road":
                data.append([node_id])

    fields = ["node_id"]

    with open("road.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data)


def generate_walk_edge_csv():
    data = []
    id = 0

    with open("raw_data/nodedata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for node_id, node_name, node_lat, node_lon, node_type, node_neighbors in reader:
            neighbors = node_neighbors.split("/")
            for neighbor_id in neighbors:
                if node_id == neighbor_id:
                    print("error: " + node_id + " " + node_name)
                if {node_id, neighbor_id} not in data:
                    data.append({node_id, neighbor_id})
    
    data_with_id = []
    for row in data:
        data_with_id.append([id] + list(row))
        id += 1

    fields = ["edge_id", "start_id", "end_id"]

    with open("walk_edge.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data_with_id)


def generate_route_csv():
    id = 0
    data = []

    with open("raw_data/routedata.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for start_name, start_id, end_name, end_id, duration, services, route_coordinates in reader:
            route_coordinates = route_coordinates.split()
            plot_coordinates = []
            for coordinate in route_coordinates:
                plot_coordinates.append(list(map(lambda x: float(x), coordinate.split("/"))))
            data.append([id, start_id, end_id, duration, polyline.encode(plot_coordinates)])
            id += 1
    
    fields = ["edge_id", "start_id", "end_id", "duration", "polyline"]

    with open("bus_edge.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
        writer.writerows(data)
            
#generate_node_csv()
#generate_landmark_csv()
#generate_bus_stop_csv()
#generate_road_csv()
#generate_walk_edge_csv()
#generate_route_csv()