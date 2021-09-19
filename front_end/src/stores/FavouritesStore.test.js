import NodesGateway from "../gateways/NodesGateway";
import FavouritesGateway from "../gateways/FavouritesGateway";
import NodeStore from "./NodeStore";
import FavouritesStore, { ERR_FAV, ERR_UNFAV } from "./FavouritesStore";

jest.mock('../gateways/NodesGateway');
jest.mock("../gateways/FavouritesGateway");

const nodesGateway = new NodesGateway();
let nodeStore = new NodeStore(nodesGateway);
const gateway = new FavouritesGateway();
let store = new FavouritesStore(gateway, nodeStore);

beforeEach(async () => {
    nodeStore = new NodeStore(nodesGateway);
    await nodeStore.fetchNodes();
    store = new FavouritesStore(gateway, nodeStore);
    await store.fetchFavourites(); 
});

it('Test constructor', () => {
    const store = new FavouritesStore(gateway, nodeStore);
    expect(store.getFavourites()).toHaveLength(0);
});

it('Test fetch', async () => {
    const favs = store.getFavourites();
    expect(favs).toEqual([6]);
})

it('Test add', async () => {
    await store.addFavourite(13);
    const favs = store.getFavourites();
    expect(favs).toEqual([6, 13]);

    const nodesFav = nodeStore.getFavourites();
    const nodesUnFav = nodeStore.getNonFavourites();
    expect(nodesFav).toHaveLength(2);
    expect(nodesUnFav).toHaveLength(1);
});

it('Test add with invalid', async () => {
    const test = async () => { await store.addFavourite(6); }
    await expect(test).rejects.toThrow(ERR_FAV);
    const favs = store.getFavourites();
    expect(favs).toHaveLength(1);

    const nodesFav = nodeStore.getFavourites();
    const nodesUnFav = nodeStore.getNonFavourites();
    expect(nodesFav).toHaveLength(1);
    expect(nodesUnFav).toHaveLength(2);
});

it('Test remove', async () => {
    await store.removeFavourite(6);
    const favs = store.getFavourites();
    expect(favs).toHaveLength(0);

    const nodesFav = nodeStore.getFavourites();
    const nodesUnFav = nodeStore.getNonFavourites();
    expect(nodesFav).toHaveLength(0);
    expect(nodesUnFav).toHaveLength(3);
});

it('Test remove with invalid', async () => {
    const test = async () => { await store.removeFavourite(13); }
    await expect(test).rejects.toThrow(ERR_UNFAV);
    const favs = store.getFavourites();
    expect(favs).toHaveLength(1);

    const nodesFav = nodeStore.getFavourites();
    const nodesUnFav = nodeStore.getNonFavourites();
    expect(nodesFav).toHaveLength(1);
    expect(nodesUnFav).toHaveLength(2);
})
