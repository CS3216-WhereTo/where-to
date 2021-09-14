import MicroEmitter from 'micro-emitter';

/**
 * Exposes the following functions:
 * - `fetchNodes()` - fetches all locations from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getFavourites()` - retrieve all locally stored favourited locations
 * - `getNonFavourites()` - retrieve all locally stored non-favourited locations
 */
export default function NodeStore(nodeGateway) {

    let nodes = [];
    let favourites = [];

    const UPDATE = 'UPDATE';

    const emitter = new MicroEmitter();

    /**
     * Fetches and updates the list of nodes.
     */
    function fetchNodes() {
        return nodeGateway.get().then(setNodes)
    }

    function setNodes(result) {
        favourites = result.favourites;
        nodes = result.non_favourites;
        emitter.emit(UPDATE);
    }

    /**
     * Sets a handler that is called when the data changes.
     * 
     * @param {Function} handler
     */
    function onChange(handler) {
        emitter.on(UPDATE, handler);
    }

    /**
     * Returns all favourited nodes.
     * 
     * @returns {[{node_id: number, name: string, lat: number, lon: number, type: string}]} nodes
     */
    function getFavourites() {
        return favourites;
    }

    /**
     * Returns all unfavourited nodes.
     * 
     * @returns {[{node_id: number, name: string, lat: number, lon: number, type: string}]} nodes
     */
    function getNonFavourites() {
        return nodes;
    }

    return Object.freeze({
        fetchNodes,
        onChange,
        getFavourites,
        getNonFavourites
    })

}
