import MicroEmitter from 'micro-emitter';

/**
 * Exposes three functions:
 * - `fetchRoutes(startId, endId)` - fetches the walking and bus route from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getRoutes()` - retrieve walking and bus routes
 */
export default function RouteStore(gateway) {
    
    let walkRoute;
    let busRoute;

    const UPDATE = 'UPDATE'

    const eventEmitter = new MicroEmitter();

    /**
     * Gets the routes from `startId` to `endId` and stores it.
     * 
     * @param {number} startId 
     * @param {number} endId 
     */
    function fetchRoutes(startId, endId) {
        return gateway
            .getRoutes('', { start_id: startId, end_id: endId })
            .then(setRoutes);
    }

    function setRoutes(result) {
        walkRoute = result.walk;
        busRoute = result.bus;
        eventEmitter.emit(UPDATE);
    }

    /**
     * Sets a listener function that is called when the store is updated.
     * 
     * @param {Function} handler 
     */
    function onChange(handler) {
        eventEmitter.on(UPDATE, handler);
    }

    /**
     * Returns the walking and 
     * @returns {{walk: any, bus: any}} routes
     */
    function getRoutes() {
        return { walk: walkRoute, bus: busRoute };
    }

    return Object.freeze({
        fetchRoutes,
        onChange,
        getRoutes
    })

}
