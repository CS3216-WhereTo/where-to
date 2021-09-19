from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField, TextField, FloatField
from django.db.models.fields.related import ForeignKey, OneToOneField

# Create your models here.

class Node(models.Model):
    node_id = IntegerField(primary_key=True)
    name = TextField()
    lat = FloatField()
    lon = FloatField()

class Landmark(Node):
    pass

class BusStop(Node):
    stop_duration = IntegerField()

class Road(Node):
    pass
