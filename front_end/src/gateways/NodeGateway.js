import axios from "axios";
import checkUserLoggedIn, { getUserToken } from "../utils/AuthChecker";

export default class NodeGateway {

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        const headers = {};
        const loggedIn = await checkUserLoggedIn();
        if (loggedIn) headers['Authorization'] = `Bearer ${getUserToken()}`;

        const response = await axios.get('nodes/list_nodes', {
            headers: headers
        });
        return response.data;
    }

    /**
     * Sends a GET request for the nearest node from the given coordinates.
     * 
     * @param {{lat: number, lon: number}} coords 
     */
    async findNearest(coords) {
        const response = await axios.get('node/find_nearest_node', {
            headers: { 'Content-Type': 'application/json' },
            params: coords
        });
        return response.data;
    }

}
