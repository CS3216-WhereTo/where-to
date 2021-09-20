from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField, TextField, FloatField
from django.db.models.fields.related import ForeignKey, OneToOneField

# Create your models here.

class Node(models.Model):
    node_id = IntegerField(primary_key=True)
    name = TextField()
    latitude = FloatField()
    longitude = FloatField()

class Landmark(Node):
    pass

class BusStop(Node):
    stop_duration = IntegerField()

class Road(Node):
    pass

class WalkEdge(models.Model):
    start_id = ForeignKey(Node, on_delete=CASCADE, related_name='walk_start')
    end_id = ForeignKey(Node, on_delete=CASCADE, related_name='walk_end')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_id', 'end_id'], name='walk edges are unique')
        ]

class BusEdge(models.Model):
    start_id = ForeignKey(Node, on_delete=CASCADE, related_name='bus_start')
    end_id = ForeignKey(Node, on_delete=CASCADE, related_name='bus_end')
    duration = IntegerField()
    polyline = TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_id', 'end_id'], name='bus edges are unique')
        ]

class BusService(models.Model):
    edge_id = OneToOneField(BusEdge, on_delete=CASCADE, primary_key=True)
    service = CharField(max_length=5)
