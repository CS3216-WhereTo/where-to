from django.db import models
from django.db.models.fields import DecimalField, IntegerField

# Create your models here.
class User(models.Model):
    google_id = DecimalField(max_digits=21, decimal_places=0, unique=True) # unique imples indexed
    walking_speed = IntegerField()
