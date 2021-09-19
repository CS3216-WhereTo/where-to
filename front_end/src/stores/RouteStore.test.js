import RouteGateway, * as mockResponse from "../gateways/RouteGateway";
import RouteStore, { ERR_MSG } from "./RouteStore";

jest.mock("../gateways/RouteGateway");

const gateway = new RouteGateway();

it('Test constructor', () => {
    const store = new RouteStore(gateway);
    expect(store.walkRoute).toBeNull();
    expect(store.busRoute).toBeNull();
});

it('Test fetchRoutes', async () => {
    const store = new RouteStore(gateway);
    await store.fetchRoutes(1, 2);
    const route = store.getRoutes();
    expect(route.walk).toEqual(mockResponse.walkRoute);
    expect(route.bus).toEqual(mockResponse.busRoute);
});

it('Test fetchRoutes with dupe args', async () => {
    const store = new RouteStore(gateway);
    const test = async () => { await store.fetchRoutes(1, 1); };
    await expect(test).rejects.toThrow(ERR_MSG);
});
