import MicroEmitter from "micro-emitter";
import UserGateway from "../gateways/UserGateway";

const emitter = new MicroEmitter();
const eventSpeed = 'UPDATE_SPEED';
const eventRecents = 'UPDATE_RECENTS';

export const ERR_INVALID_SPD = 'Invalid speed was given';

export default class UserStore {

    #speed;
    #recents;

    /**
     * @param {UserGateway} gateway 
     */
    constructor(gateway) {
        this.#speed = 0;
        this.#recents = [];
        this.gateway = gateway;
    }

    fetchRecents() {
        return this.gateway
            .getRecents()
            .then((res) => this._setRecents(res))
            .catch(console.error);
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
            .catch(console.error);
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
