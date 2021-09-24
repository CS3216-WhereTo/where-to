const DEFAULT_SPEED = 1.4;

export const ERR_INVALID_SPD = "Invalid speed was given";

export const SPEED_KEY = "userSpeed";
export const RECENTS_KEY = "recents";

export default class UserStore {
  #speed;
  #recents;

  /**
   * @param {UserGateway} gateway
   */
  constructor(gateway) {
    this.#speed = DEFAULT_SPEED;
    this.#recents = [];
    this.gateway = gateway;
  }

  ////////////////////////////////
  // RECENTS PART
  ////////////////////////////////

  fetchRecents(callback) {
    return this.gateway
      .getRecents()
      .then((res) => {
        this._setRecents(res.recents, callback);
      })
      .catch((e) => {
        console.error(e);
        this._loadRecentsFromStorage(callback);
      });
  }

  _loadRecentsFromStorage(callback) {
    const recents = localStorage.getItem(RECENTS_KEY);
    this.#recents = recents ? JSON.parse(recents) : [];
    callback();
    this._updateLocalRecents();
  }

  _setRecents(recents, callback) {
    this.#recents = recents;
    callback();
    this._updateLocalRecents();
  }

  // limit to 5?
  _updateLocalRecents() {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(this.#recents));
  }

  getRecents() {
    return this.#recents;
  }

  ////////////////////////////////
  // SPEED PART
  ////////////////////////////////

  fetchSpeed(callback) {
    return this.gateway
      .getWalkingSpeed()
      .then((res) => this._updateSpeed(res, callback))
      .catch((e) => {
        console.error(e);
        this._loadSpeedFromStorage(callback);
      });
  }

  _loadSpeedFromStorage(callback) {
    const speed = localStorage.getItem(SPEED_KEY);
    this.#speed = speed ? JSON.parse(speed) : DEFAULT_SPEED;
    callback();
    this._updateLocalSpeed();
  }

  _updateSpeed(res, callback) {
    this.#speed = res.speed;
    callback();
    this._updateLocalSpeed();
  }

  _updateLocalSpeed() {
    localStorage.setItem(SPEED_KEY, JSON.stringify(this.#speed));
  }

  getSpeed() {
    return this.#speed;
  }

  setSpeed(newSpeed, callback) {
    if (newSpeed < 0) throw new Error(ERR_INVALID_SPD);
    return this.gateway
      .postWalkingSpeed(newSpeed)
      .then((res) => {
        if (res.error !== 0) throw new Error(ERR_INVALID_SPD);
        this._updateSpeed({ speed: newSpeed }, callback);
      })
      .catch(console.error);
  }
}
