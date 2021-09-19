from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField, TextField
from django.db.models.fields.related import ForeignKey
from nodes.models import Node, BusStop

# Create your models here.

class WalkEdge(models.Model):
    id = IntegerField(primary_key=True)
    start = ForeignKey(Node, on_delete=CASCADE, related_name='walk_start')
    end = ForeignKey(Node, on_delete=CASCADE, related_name='walk_end')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start', 'end'], name='walk edges are unique')
        ]

class BusEdge(models.Model):
    id = IntegerField(primary_key=True)
    start = ForeignKey(BusStop, on_delete=CASCADE, related_name='bus_start')
    end = ForeignKey(BusStop, on_delete=CASCADE, related_name='bus_end')
    duration = IntegerField()
    polyline = TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start', 'end'], name='bus edges are unique')
        ]

class BusService(models.Model):
    id = IntegerField(primary_key=True)
    edge = ForeignKey(BusEdge, on_delete=CASCADE)
    service = CharField(max_length=5)
