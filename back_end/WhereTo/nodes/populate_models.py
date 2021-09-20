import csv
from nodes.models import Node, Landmark, BusStop, Road

""" 
to use this file:
1. run "python manage.py shell" in back_end/WhereTo
2. "from nodes.populate_models import populate_node, populate_landmark" etc
3. "populate_node()", etc
"""

def populate_node():

    with open("nodes/data/node.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for id, name, lat, lon in reader:
            node = Node(id = id, name = name, lat = lat, lon = lon)
            try:
                node.save()
            except:
                print(f"Error with database insertion: {id} {name} {lat} {lon}")


def populate_busstop():

    with open("nodes/data/bus_stop.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for node, stop_duration in reader:
            busstop = BusStop(node = Node.objects.get(id = node), stop_duration = stop_duration)
            try:
                busstop.save()
            except:
                print(f"Error with database insertion: {node} {stop_duration}")


def populate_landmark():

    with open("nodes/data/landmark.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            node = row[0]
            landmark = Landmark(node = Node.objects.get(id = node))
            try:
                landmark.save()
            except:
                print(f"Error with database insertion: {node}")


def populate_road():

    with open("nodes/data/road.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            node = row[0]
            road = Road(node = Node.objects.get(id = node))
            try:
                road.save()
            except:
                print(f"Error with database insertion: {node}")