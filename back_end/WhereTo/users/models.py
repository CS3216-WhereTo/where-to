from django.db.models.deletion import CASCADE
from django.db import models
from django.db.models.fields import DateTimeField, DecimalField, IntegerField, TextField
from django.db.models.fields.related import ForeignKey

# Create your models here.
class User(models.Model):
    google_id = DecimalField(max_digits=21, decimal_places=0, unique=True) # unique implies indexed
    walking_speed = IntegerField()

class Recent(models.Model):
    user_id = ForeignKey(User, on_delete=CASCADE)
    route = TextField()
    access_time = DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user_id', '-access_time'])
        ]
