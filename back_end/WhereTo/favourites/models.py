from django.db.models.deletion import CASCADE
from users.models import User
from nodes.models import Node
from django.db import models
from django.db.models.fields.related import ForeignKey

# Create your models here.
class Favourite(models.Model):
    user_id = ForeignKey(User, on_delete=CASCADE, db_index=True)
    node_id = ForeignKey(Node, on_delete=CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user_id', 'node_id'], name='user can only favourite a node once')
        ]