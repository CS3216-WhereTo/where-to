export const ERR_MSG = "Start ID should not be the same as the destination ID";

export const BUS_KEY = "busRoute";
export const WALK_KEY = "walkRoute";

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
  }

  /**
   * Gets the routes from `startId` to `endId` and stores it.
   *
   * @param {number} startId
   * @param {number} endId
   */
  fetchRoutes(startId, endId, callback) {
    if (startId === endId) throw new Error(ERR_MSG);
    return this.gateway
      .getRoutes({ start_id: startId, end_id: endId })
      .then((res) => this._setRoutes(res, callback))
      .catch((e) => {
        console.error(e);
        this._loadLastRouteFromStorage(callback);
      });
  }

  _loadLastRouteFromStorage(callback) {
    const walkRoute = localStorage.getItem(WALK_KEY);
    const busRoute = localStorage.getItem(BUS_KEY);
    this.#walkRoute = walkRoute ? JSON.parse(walkRoute) : [];
    this.#busRoute = busRoute ? JSON.parse(busRoute) : [];
    callback();
    this._updateLocalStorage();
  }

  _setRoutes(result, callback) {
    this.#walkRoute = result.walk;
    this.#busRoute = result.bus;
    callback();
    this._updateLocalStorage();
  }

  _updateLocalStorage() {
    localStorage.setItem(WALK_KEY, JSON.stringify(this.#walkRoute));
    localStorage.setItem(BUS_KEY, JSON.stringify(this.#busRoute));
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
