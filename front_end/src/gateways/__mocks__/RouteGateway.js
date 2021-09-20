export const walkRoute = {
    total_duration: 300,
    total_distance: 450,
    polyline: "",
    nodes: [346, 437, 410, 409, 492, 6, 346]
};

export const busSegment = {
    transport_type: "bus",
    duration: 480,
    services: [
        { code: "A2", wait_time: 10 },
        { code: "D1", wait_time: 10 }
    ],
    polyline: "",
    nodes: [21, 5, 6]
};
export const walkSegment = {
    transport_type: "walk",
    duration: 60,
    distance: 50,
    polyline: "",
    nodes: [6, 346]
};
export const busRoute = {
    total_duration: 550,
    segments: [ busSegment, walkSegment ]
};

export default class RouteGateway {

    async getRoutes(_) {
        return {
            walk: walkRoute,
            bus: busRoute
        }
    }

    async getWalking(_) {
        return walk;
    }

    async getBus(_) {
        return bus;
    }

}
