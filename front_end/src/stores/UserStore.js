import MicroEmitter from "micro-emitter";
import { emit, eventNames } from "process";
import UserGateway from "../gateways/UserGateway";

const DEFAULT_SPEED = 1.4;

const emitter = new MicroEmitter();
const eventSpeed = "UPDATE_SPEED";
const eventRecents = "UPDATE_RECENTS";

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

    emitter.on(eventSpeed, () => this._updateLocalSpeed());
    emitter.on(eventRecents, () => this._updateLocalRecents());
  }

  _updateLocalSpeed() {
    localStorage.setItem(SPEED_KEY, JSON.stringify(this.#speed));
  }

  _updateLocalRecents() {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(this.#recents));
  }

  fetchRecents() {
    return this.gateway
      .getRecents()
      .then((res) => this._setRecents(res))
      .catch((e) => {
        console.error(e);
        this._loadRecentsFromStorage();
      });
  }

  _loadSpeedFromStorage() {
    const speed = localStorage.getItem(SPEED_KEY);
    this.#speed = speed ? JSON.parse(speed) : DEFAULT_SPEED;
    emitter.emit(eventSpeed);
  }

  _loadRecentsFromStorage() {
    const recents = localStorage.getItem(RECENTS_KEY);
    this.#recents = recents ? JSON.parse(recents) : [];
    emitter.emit(eventRecents);
  }

  onChangeRecents(handler) {
    emitter.on(eventRecents, handler);
  }

  _setRecents(recents) {
    this.#recents = recents.nodes;
    emitter.emit(eventRecents);
  }

  getRecents() {
    return [...this.#recents];
  }

  fetchSpeed() {
    return this.gateway
      .getWalkingSpeed()
      .then((res) => this._updateSpeed(res))
      .catch((e) => {
        console.error(e);
        this._loadSpeedFromStorage();
      });
  }

  _updateSpeed(res) {
    this.#speed = res.speed;
    emitter.emit(eventSpeed);
  }

  onChangeSpeed(handler) {
    emitter.on(eventSpeed, handler);
  }

  getSpeed() {
    return this.#speed;
  }

  setSpeed(newSpeed) {
    if (newSpeed < 0) throw new Error(ERR_INVALID_SPD);
    return this.gateway
      .postWalkingSpeed(newSpeed)
      .then((res) => {
        if (res.error !== 0) throw new Error(ERR_INVALID_SPD);
        this._updateSpeed({ speed: newSpeed });
      })
      .catch(console.error);
  }
}
