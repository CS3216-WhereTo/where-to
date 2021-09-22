import MicroEmitter from 'micro-emitter';

export const ERR_MSG = "Start ID should not be the same as the destination ID";

export const BUS_KEY = "busRoute";
export const WALK_KEY = "walkRoute";

const event = "UPDATE_ROUTE";
const emitter = new MicroEmitter();

/**
 * Exposes three functions:
 * - `fetchRoutes(startId, endId)` - fetches the walking and bus route from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getRoutes()` - retrieve walking and bus routes
 */
export default class RouteStore {
  #walkRoute;
  #busRoute;

  /**
   * @param {RouteGateway} routeGateway
   */
  constructor(routeGateway) {
    this.#walkRoute = null;
    this.#busRoute = null;
    this.gateway = routeGateway;

    emitter.on(event, () => this._updateLocalStorage());
  }

  _updateLocalStorage() {
    localStorage.setItem(WALK_KEY, JSON.stringify(this.#walkRoute));
    localStorage.setItem(BUS_KEY, JSON.stringify(this.#busRoute));
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
      .getRoutes({ start_id: startId, end_id: endId })
      .then((res) => this._setRoutes(res))
      .catch((e) => {
        console.error(e);
        this._loadLastRouteFromStorage();
      });
  }

  _loadLastRouteFromStorage() {
    const walkRoute = localStorage.getItem(WALK_KEY);
    const busRoute = localStorage.getItem(BUS_KEY);
    this.#walkRoute = walkRoute ? JSON.parse(walkRoute) : [];
    this.#busRoute = busRoute ? JSON.parse(busRoute) : [];
    emitter.emit(event);
  }

  _setRoutes(result) {
    this.#walkRoute = result.walk;
    this.#busRoute = result.bus;
    emitter.emit(event);
  }

  /**
   * Sets a listener function that is called when the store is updated.
   *
   * @param {Function} handler
   */
  onChange(handler) {
    emitter.on(event, handler);
  }

  /**
   * Returns the walking and
   * @returns {{walk: any, bus: any}} routes
   */
  getRoutes() {
    return { walk: this.#walkRoute, bus: this.#busRoute };
  }

  getWalkRoute() {
    return this.#walkRoute == null ? null : { ...this.#walkRoute };
  }

  getBusRoute() {
    return this.#busRoute == null ? null : { ...this.#busRoute };
  }
}
