import NodeGateway, { kentRidge, infoTech, lt32 } from "../gateways/NodeGateway";
import FavouritesGateway from "../gateways/FavouritesGateway";
import NodeStore, { ERR_UNFAV, ERR_FAV } from "./NodeStore";

jest.mock('../gateways/FavouritesGateway')
jest.mock('../gateways/NodeGateway');

const nodeGateway = new NodeGateway();
const favGateway = new FavouritesGateway();
let store = new NodeStore(nodeGateway, favGateway);

beforeEach(async () => {
    store = new NodeStore(nodeGateway, favGateway);
    await store.fetchNodes();
})

it('Test contructor', () => {
    const store = new NodeStore(nodeGateway);
    expect(store.getFavourites()).toHaveLength(0);
    expect(store.getNonFavourites()).toHaveLength(0);
});

it('Test fetch', async () => {
    const store = new NodeStore(nodeGateway);
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

it('Test addFavourite', async () => {
    await store.addFavourite(13);
    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech, kentRidge ]);
    expect(nonFavs).toEqual([ lt32 ]);
});

it('Test addFavourite with already fav', async () => {
    const test = async () => await store.addFavourite(6);
    await expect(test).rejects.toThrow(ERR_UNFAV);

    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech ]);
    expect(nonFavs).toEqual([ kentRidge, lt32 ]);
});

it('Test removeFavourite', async () => {
    await store.removeFavourite(6);
    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toHaveLength(0);
    expect(nonFavs).toEqual([ kentRidge, lt32, infoTech ]);
});

it('Test removeFavourite with non-fav', async () => {
    const test = async () => await store.removeFavourite(13);
    await expect(test).rejects.toThrow(ERR_FAV);

    const favs = store.getFavourites();
    const nonFavs = store.getNonFavourites();
    expect(favs).toEqual([ infoTech ]);
    expect(nonFavs).toEqual([ kentRidge, lt32 ]);
});
