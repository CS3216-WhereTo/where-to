import axios from "axios";
import userIsLoggedIn, { getUserToken } from "../utils/AuthCheck";

export default class NodeGateway {

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        const headers = {};
        if (userIsLoggedIn()) {
            headers['Authorization'] = `Bearer ${getUserToken()}`
        }
        try {
            const response = await axios.get('node/list_nodes', {
                headers: headers
            });
            return response.data();
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
                data: coords
            });
            return response.json();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}
