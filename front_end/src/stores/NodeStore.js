import MicroEmitter from 'micro-emitter';
import NodeGateway from '../gateways/NodesGateway'

const ERR_FAV = "This node is not in the favourites!";
const ERR_UNFAV = "This node is not in the non favourites!";

/**
 * Exposes the following functions:
 * - `fetchNodes()` - fetches all locations from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getFavourites()` - retrieve all locally stored favourited locations
 * - `getNonFavourites()` - retrieve all locally stored non-favourited locations
 */
export default class NodeStore {

    /**
     * @param {NodeGateway} gateway 
     */
    constructor(gateway) {
        this.nonFavourites = [];
        this.favourites = [];
        this.gateway = gateway;

        const update = 'UPDATE';
        const emitter = new MicroEmitter();

        this.getEventType = () => update;
        this.getEmitter = () => emitter;
    }

    /**
     * Fetches and updates the list of nodes.
     */
    fetchNodes() {
        return this.gateway
            .get()
            .then(res => this._setNodes(res))
            .catch(e => console.error(e));
    }

    _setNodes(result) {
        this.favourites.splice(0, this.favourites.length, ...result.favourites);
        this.nonFavourites.splice(0, this.nonFavourites.length, ...result.non_favourites);
        this.getEmitter().emit(this.getEventType());
    }

    removeFavourite(nodeId) {
        const idx = this.favourites.findIndex(node => node.node_id == nodeId);
        if (idx < 0) throw new Error(ERR_FAV);
        const node = this.favourites[idx];
        this.favourites.splice(idx, 1);
        this.nonFavourites.push(node);
        this.getEmitter().emit(this.getEventType());
    }

    addFavourite(nodeId) {
        const idx = this.nonFavourites.findIndex(node => node.node_id == nodeId);
        if (idx < 0) throw new Error(ERR_UNFAV);
        const node = this.nonFavourites[idx];
        this.nonFavourites.splice(idx, 1);
        this.favourites.push(node);
        this.getEmitter().emit(this.getEventType());
    }

    /**
     * Sets a handler that is called when the data changes.
     * 
     * @param {Function} handler
     */
    onChange(handler) {
        this.getEmitter().on(this.getEventType(), handler);
    }

    /**
     * Returns all favourited nodes.
     * 
     * @returns {[{node_id: number, name: string, lat: number, lon: number, type: string}]} nodes
     */
    getFavourites() {
        return [...this.favourites];
    }

    /**
     * Returns all unfavourited nodes.
     * 
     * @returns {[{node_id: number, name: string, lat: number, lon: number, type: string}]} nodes
     */
    getNonFavourites() {
        return [...this.nonFavourites];
    }

    /**
     * Returns the node ID of the nearest node to the given coordinates. The calling function
     * should check for himself whether the node is in the favourites or not.
     * 
     * @param {{lat: number, lon: number}} coord 
     * @returns {number}
     */
    getNearestNode(coord) {
        return this.gateway
            .findNearest(coord)
            .then(res => res.node_id)
            .catch(console.error);
    }

}
