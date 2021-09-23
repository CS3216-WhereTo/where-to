export const ERR_FAV = "This node is not in the favourites!";
export const ERR_UNFAV = "This node is not in the non favourites!";
export const ERR_INVALID_FAV_ARG = "Invalid input was given!";

export const FAV_KEY = "favouriteNodes";
export const NONFAV_KEY = "nonFavouriteNodes";

/**
 * Exposes the following functions:
 * - `fetchNodes()` - fetches all locations from the API
 * - `onChange(handler)` - sets a handler function that is called upon any change in data
 * - `getFavourites()` - retrieve all locally stored favourited locations
 * - `getNonFavourites()` - retrieve all locally stored non-favourited locations
 */
export default class NodeStore {
  #nonFavourites;
  #favourites;

  /**
   * @param {NodeGateway} nodeGateway
   * @param {FavouritesGateway} favGateway
   */
  constructor(nodeGateway, favGateway) {
    this.#nonFavourites = [];
    this.#favourites = [];
    this.nodeGateway = nodeGateway;
    this.favGateway = favGateway;
  }

  /**
   * Fetches and updates the list of nodes.
   */
  fetchNodes(callback) {
    return this.nodeGateway
      .get()
      .then((res) => this._setNodes(res, callback))
      .catch((e) => {
        console.error(e);
        this._loadNodesFromStorage(callback);
      });
  }

  _setNodes(result, callback) {
    this.#favourites = result.favourites.slice();
    this.#nonFavourites = result.non_favourites.slice();
    callback();
    this._updateLocalStorage();
  }

  _loadNodesFromStorage(callback) {
    const favStr = localStorage.getItem(FAV_KEY);
    const nonFavStr = localStorage.getItem(NONFAV_KEY);
    this.#favourites = favStr ? JSON.parse(favStr) : [];
    this.#nonFavourites = nonFavStr ? JSON.parse(nonFavStr) : [];
    callback();
    this._updateLocalStorage();
  }

  _updateLocalStorage() {
    localStorage.setItem(FAV_KEY, JSON.stringify(this.#favourites));
    localStorage.setItem(NONFAV_KEY, JSON.stringify(this.#nonFavourites));
  }

  removeFavourite(nodeId, callback) {
    const idx = this.#favourites.findIndex((node) => node.node_id === nodeId);
    // if (idx < 0) throw new Error(ERR_FAV);
    if (idx < 0) {
      console.log(ERR_FAV);
      return;
    }
    return this.favGateway
      .remove(nodeId)
      .then((res) => {
        if (res.error !== 0) throw new Error(ERR_INVALID_FAV_ARG);

        const node = this.#favourites[idx];
        this.#favourites.splice(idx, 1);
        this.#nonFavourites.push(node);
        callback();
        this._updateLocalStorage();
      })
      .catch(console.error);
  }

  addFavourite(nodeId, callback) {
    const idx = this.#nonFavourites.findIndex((node) => node.node_id === nodeId);
    // if (idx < 0) throw new Error(ERR_UNFAV);
    if (idx < 0) {
      console.log(ERR_UNFAV);
      return;
    }
    return this.favGateway
      .add(nodeId)
      .then((res) => {
        if (res.error !== 0) throw new Error(ERR_INVALID_FAV_ARG);

        const node = this.#nonFavourites[idx];
        this.#nonFavourites.splice(idx, 1);
        this.#favourites.push(node);
        callback();
        this._updateLocalStorage();
      })
      .catch(console.error);
  }

  /**
   * Returns all favourited nodes.
   *
   * @returns {[{node_id: number, name: string, coordinates: [number, number]]} nodes
   */
  getFavourites() {
    return [...this.#favourites];
  }

  /**
   * Returns all unfavourited nodes.
   *
   * @returns {[{node_id: number, name: string, coordinates: [number, number]]} nodes
   */
  getNonFavourites() {
    return [...this.#nonFavourites];
  }

  /**
   * Returns the node ID of the nearest node to the given coordinates. The calling function
   * should check for himself whether the node is in the favourites or not.
   *
   * @param {{node_id: number, name: string, coordinates: [number, number]}} node
   */
  getNearestNode(coord) {
    return this.nodeGateway
      .findNearest(coord)
      .then((res) => res.node_id)
      .catch(console.error);
  }
}
