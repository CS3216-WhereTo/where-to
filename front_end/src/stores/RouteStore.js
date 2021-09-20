import MicroEmitter from 'micro-emitter';

export const ERR_MSG = "Start ID should not be the same as the destination ID";

/**
 * Exposes three functions:
 * - `fetchRoutes(startId, endId)` - fetches the walking and bus route from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getRoutes()` - retrieve walking and bus routes
 */
export default class RouteStore {
    
    /**
     * @param {RouteGateway} routeGateway 
     */
    constructor(routeGateway) {
        this.walkRoute = null;
        this.busRoute = null;
        this.gateway = routeGateway;

        const eventType = 'UPDATE';
        const emitter = new MicroEmitter();

        this.getEventType = () => eventType;
        this.getEmitter = () => emitter;
    }

    /**
     * Gets the routes from `startId` to `endId` and stores it.
     * 
     * @param {number} startId 
     * @param {number} endId 
     */
    fetchRoutes(startId, endId) {
        if (startId === endId) throw new Error(ERR_MSG);
        return this.gateway
            .getRoutes('', { start_id: startId, end_id: endId })
            .then(res => this._setRoutes(res))
            .catch(console.error);
    }

    _setRoutes(result) {
        this.walkRoute = result.walk;
        this.busRoute = result.bus;
        this.getEmitter().emit(this.getEventType());
    }

    /**
     * Sets a listener function that is called when the store is updated.
     * 
     * @param {Function} handler 
     */
    onChange(handler) {
        this.getEmitter().on(this.getEventType(), handler);
    }

    /**
     * Returns the walking and 
     * @returns {{walk: any, bus: any}} routes
     */
    getRoutes() {
        return { walk: this.walkRoute, bus: this.busRoute };
    }

}
