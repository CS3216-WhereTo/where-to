import csv
from routes.models import WalkEdge, BusEdge, BusService
from nodes.models import Node, BusStop

""" 
to use this file:
1. run "python manage.py shell" in back_end/WhereTo
2. "from routes.populate_models import populate_walkedge" etc
3. "populate_walkedge()", etc
"""

def populate_walkedge():

    with open("routes/data/walk_edge.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for id, start, end in reader:
            walkedge = WalkEdge(id = id, start = Node.objects.get(id = start), end = Node.objects.get(id = end))
            try:
                walkedge.save()
            except:
                print(f"Error with database insertion: {id} {start} {end}")


def populate_busedge():

    with open("routes/data/bus_edge.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for id, start, end, duration, polyline in reader:
            busedge = BusEdge(id = id, start = BusStop.objects.get(node = start), end = BusStop.objects.get(node = end), duration = duration, polyline = polyline)
            try:
                busedge.save()
            except:
                print(f"Error with database insertion: {id} {start} {end} {duration}")


def populate_busservice():

    with open("routes/data/bus_service.csv") as f:
        reader = csv.reader(f)
        next(reader)
        for id, edge, service in reader:
            busservice = BusService(id = id, edge = BusEdge.objects.get(id = edge), service = service)
            try:
                busservice.save()
            except:
                print(f"Error with database insertion: {id} {edge} {service}")