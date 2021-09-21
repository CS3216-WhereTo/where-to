import axios from "axios";
import userIsLoggedIn, { getUserToken } from "../utils/AuthChecker";

export default class NodeGateway {

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        const headers = {};
        if (userIsLoggedIn()) headers['Authorization'] = `Bearer ${getUserToken()}`;

        console.log(headers);
        try {
            const response = await axios.get('nodes/list_nodes', {
                headers: headers,
                params: {}
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Sends a GET request for the nearest node from the given coordinates.
     * 
     * @param {{lat: number, lon: number}} coords 
     */
    async findNearest(coords) {
        try {
            const response = await axios.get('node/find_nearest_node', {
                headers: { 'Content-Type': 'application/json' },
                params: coords
            });
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}
