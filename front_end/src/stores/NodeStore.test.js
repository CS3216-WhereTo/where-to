import NodesGateway, { kentRidge, infoTech, lt32 } from "../gateways/NodesGateway";
import NodeStore, { ERR_UNFAV, ERR_FAV } from "./NodeStore";

jest.mock('../gateways/NodesGateway');

const gateway = new NodesGateway();
let store = new NodeStore(gateway);

beforeEach(async () => {
    store = new NodeStore(gateway);
    await store.fetchNodes();
})

it('Test contructor', () => {
    const store = new NodeStore(gateway);
    expect(store.favourites).toHaveLength(0);
    expect(store.nonFavourites).toHaveLength(0);
});

it('Test fetch', async () => {
    const store = new NodeStore(gateway);
    try {
        await store.fetchNodes();
        const favs = store.getFavourites();
        const nonFavs = store.getNonFavourites();
        expect(favs).toEqual([infoTech]);
        expect(nonFavs).toEqual([ kentRidge, lt32 ]);
    } catch (e) {
        console.log(e);
        fail(e);
    }
});

it('Test findNearest', async () => {
    const coords = { lat: 0.0, lon: 0.0 };
    try {
        const result = await store.getNearestNode(coords);
        expect(result).toEqual(13);
    } catch (e) {
        console.error(e);
        fail(e);
    }
});

it('Test addFavourite', () => {
    store.addFavourite(13);
    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech, kentRidge ]);
    expect(nonFavs).toEqual([ lt32 ]);
});

it('Test addFavourite with already fav', () => {
    const test = () => store.addFavourite(6);
    expect(test).toThrow(ERR_UNFAV);

    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech ]);
    expect(nonFavs).toEqual([ kentRidge, lt32 ]);
});

it('Test removeFavourite', () => {
    store.removeFavourite(6);
    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toHaveLength(0);
    expect(nonFavs).toEqual([ kentRidge, lt32, infoTech ]);
});

it('Test removeFavourite with already fav', () => {
    const test = () => store.removeFavourite(13);
    expect(test).toThrow(ERR_FAV);

    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech ]);
    expect(nonFavs).toEqual([ kentRidge, lt32 ]);
});
