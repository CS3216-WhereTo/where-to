const axios = require('axios').default;

export default class NodeGateway {

    constructor() {
        this.token = '';
    }

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        try {
            const response = await axios.get('node/list_nodes', {
                headers: { 'Authorization': `Bearer ${this.token}` }
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

    /**
     * Sets the user token
     * 
     * @param {string} userToken 
     */
    setToken(userToken) {
        this.token = userToken;
    }

}
