
export default function FavouritesStore(favGateway, nodeStore) {

    /**
     * @type {[number]}
     */
    let favourites = [];

    function addFavourite(nodeId) {
        if (favourites.includes(nodeId)) return;
        favGateway
            .add(nodeId)
            .then((res) => {
                if (res.error != 0) return;
                favourites.push(nodeId);
            });
    }

    function removeFavourite(nodeId) {
        if (!favourites.includes(nodeId)) return;
        favGateway
            .remove(nodeId)
            .then((res) => {
                if (res.error != 0) return;
                const index = favourites.indexOf(nodeId);
                if (index >= 0) favourites.splice(index, 1);
            });
    }

    return Object.freeze({
        addFavourite,
        removeFavourite
    });

}
