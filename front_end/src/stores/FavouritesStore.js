import MicroEmitter from "micro-emitter";
import FavouritesGateway from "../gateways/FavouritesGateway";
import NodeStore from "./NodeStore";

export const ERR_INVALID = "Invalid input was given!";
export const ERR_FAV = "This node is already favourited!";
export const ERR_UNFAV = "This node is already unfavourited!";

export default class FavouritesStore {

    /**
     * @param {FavouritesGateway} favGateway 
     * @param {NodeStore} nodeStore 
     */
    constructor(favGateway, nodeStore) {
        this.gateway = favGateway;
        this.nodeStore = nodeStore;
        this.favourites = [];

        const UPDATE = 'UPDATE';
        const emitter = new MicroEmitter();
        this.getEventType = () => UPDATE;
        this.getEmitter = () => emitter;
    }

    fetchFavourites() {
        return this.gateway.get()
            .then(res => {
                this.favourites = [...res.nodes];
            })
            .catch(e => console.error(e));
    }

    /**
     * Adds a newly favourited node and updates the `NodeStore` if successful.
     * If the node is already favourited it throws an error.
     * 
     * @param {number} nodeId 
     */
    addFavourite(nodeId) {
        if (this.favourites.includes(nodeId)) throw new Error(ERR_FAV);
        return this.gateway
            .add(nodeId)
            .then((res) => {
                if (res.error != 0) throw new Error(ERR_INVALID);
                this.favourites.push(nodeId);
                this.nodeStore.addFavourite(nodeId);
                this.getEmitter().emit(this.getEventType());
            })
            .catch(e => { throw e; });
    }

    /**
     * Removes a node from the favourites and updates the `NodeStore` if successful.
     * If the node did not already exist in the favourites it throws an error.
     * 
     * @param {number} nodeId 
     */
    removeFavourite(nodeId) {
        if (!this.favourites.includes(nodeId)) throw new Error(ERR_UNFAV);
        return this.gateway
            .remove(nodeId)
            .then((res) => {
                if (res.error != 0) throw new Error(ERR_INVALID);
                const index = this.favourites.indexOf(nodeId);
                if (index >= 0) this.favourites.splice(index, 1);
                this.nodeStore.removeFavourite(nodeId);
                this.getEmitter().emit(this.getEventType());
            })
            .catch(e => { throw e; });
    }

    /**
     * Sets a handler that is called when the favourites list is modified.
     * 
     * @param {Function} handler 
     */
    onChange(handler) {
        this.getEmitter().on(this.getEventType(), handler);
    }

    /**
     * Returns a copy of the list of favourited nodes.
     * @returns {[number]}
     */
    getFavourites() {
        return [...this.favourites];
    }

}
