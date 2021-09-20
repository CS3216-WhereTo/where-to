from .models import Favourite

def list_favorites(user):
    result = Favourite.objects.filter(user_id=user.id).values_list('node_id', flat=True)
    return result

def add_favorite(user, node_id):
    # TODO check nodes dictionary to validate node_id, return 1 if invalid

    entry, created = Favourite.objects.get_or_create(user_id=user.id, node_id=node_id)
    if not created:
        return 2 # duplicate entry
    
    return 0 # ok

def remove_favorite(user, node_id):
    # TODO validate node_id, see above

    num_deleted, details = Favourite.objects.filter(user_id=user.id, node_id=node_id).delete()
    if num_deleted == 0:
        return 2 # favourite did not exist
    
    return 0 # ok

