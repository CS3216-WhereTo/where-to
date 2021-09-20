
export default class FavouritesGateway {

    async get() {
        return { nodes: [6] };
    }

    async add(_) {
        return { error: 0 };
    }

    async remove(_) {
        return { error: 0 };
    }

}
