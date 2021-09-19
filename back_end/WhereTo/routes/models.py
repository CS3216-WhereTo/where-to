from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField, TextField
from django.db.models.fields.related import ForeignKey, OneToOneField
from nodes.models import Node, BusStop

# Create your models here.

class WalkEdge(models.Model):
    edge_id = IntegerField(primary_key=True)
    start_id = ForeignKey(Node, on_delete=CASCADE, related_name='walk_start')
    end_id = ForeignKey(Node, on_delete=CASCADE, related_name='walk_end')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_id', 'end_id'], name='walk edges are unique')
        ]

class BusEdge(models.Model):
    edge_id = IntegerField(primary_key=True)
    start_id = ForeignKey(BusStop, on_delete=CASCADE, related_name='bus_start')
    end_id = ForeignKey(BusStop, on_delete=CASCADE, related_name='bus_end')
    duration = IntegerField()
    polyline = TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_id', 'end_id'], name='bus edges are unique')
        ]

class BusService(models.Model):
    service_id = IntegerField(primary_key=True)
    edge_id = OneToOneField(BusEdge, on_delete=CASCADE)
    service = CharField(max_length=5)
