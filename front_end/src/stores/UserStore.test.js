import UserStore, { ERR_INVALID_SPD } from "./UserStore";
import UserGateway from "../gateways/UserGateway";

jest.mock('../gateways/UserGateway');

const gateway = new UserGateway();
let store = new UserStore(gateway);

beforeEach(async () => {
    store = new UserStore(gateway);
    await Promise.all([
        store.fetchSpeed(),
        store.fetchRecents()
    ]);
})

it('Test constructor', () => {
    const store = new UserStore(gateway);
    expect(store.getRecents()).toHaveLength(0);
    expect(store.getSpeed()).toEqual(0);
});

it('Test fetchRecents', async () => {
    const store = new UserStore(gateway);
    await store.fetchRecents();
    const recents = store.getRecents();
    const speed = store.getSpeed();
    expect(recents).toEqual([6, 13]);
    expect(speed).toEqual(0);
});

it('Test getSpeed', async () => {
    const store = new UserStore(gateway);
    await store.fetchSpeed();
    const recents = store.getRecents();
    const speed = store.getSpeed();
    expect(recents).toHaveLength(0);
    expect(speed).toEqual(4);
});

it('Test updateSpeed', async () => {
    expect(store.getSpeed()).toEqual(4);
    await store.setSpeed(13);
    const speed = store.getSpeed();
    expect(speed).toEqual(13);
})

it('Test updateSpeed bad input', async () => {
    const test = async () => { await store.setSpeed(-2); }
    await expect(test).rejects.toThrow(ERR_INVALID_SPD);
})
