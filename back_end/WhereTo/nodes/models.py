from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import IntegerField, TextField, FloatField
from django.db.models.fields.related import OneToOneField

# Create your models here.

class Node(models.Model):
    id = IntegerField(primary_key=True)
    name = TextField()
    lat = FloatField()
    lon = FloatField()

class Landmark(models.Model):
    node = OneToOneField(Node, on_delete=CASCADE, primary_key=True)

class BusStop(models.Model):
    node = OneToOneField(Node, on_delete=CASCADE, primary_key=True)
    stop_duration = IntegerField()

class Road(models.Model):
    node = OneToOneField(Node, on_delete=CASCADE, primary_key=True)