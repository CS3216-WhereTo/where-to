export const kentRidge = {
    node_id: 13,
    name: "Kent Ridge MRT",
    lat: 1.2948,
    lon: 103.7844,
    type: "bus_stop"
};
export const lt32 = {
    node_id: 267,
    name: "LT32",
    lat: 1.29602,
    lon: 103.77834,
    type: "landmark"
}
export const infoTech = {
    node_id: 6,
    name: "Information Technology",
    lat: 1.2972,
    lon: 103.7727,
    type: "bus_stop"
}

export default class NodesGateway {

    async get() {
        return {
            favourites: [ infoTech ],
            non_favourites: [ kentRidge, lt32 ]
        }
    }

    async findNearest(_) {
        return { node_id: 13 };
    }
}
