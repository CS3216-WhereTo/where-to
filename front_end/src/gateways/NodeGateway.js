import axios from "axios";
import userTokenExists, { getUserToken } from "../utils/AuthChecker";

export default class NodeGateway {

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        const headers = {};
        const loggedIn = userTokenExists();
        if (loggedIn) headers['Authorization'] = `Bearer ${getUserToken()}`;

        const response = await axios.get('nodes/list_nodes', {
            headers: headers
        });
        console.log('GET nodes/list_nodes success');
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
        console.log('GET node/find_nearest_node success');
        return response.data;
    }

}
