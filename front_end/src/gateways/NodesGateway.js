export default class NodesGateway {

    constructor() {
        this.token = '';
        this.url = '{insert URL}/node';
    }

    /**
     * Sends a GET request for all nodes.
     */
    async get() {
        try {
            const response = await fetch(`${this.url}/list_nodes`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Sends a GET request for the nearest node from the given coordinates.
     * 
     * @param {{lat: number, lon: number}} coords 
     */
    async findNearest(coords) {
        try {
            const response = await fetch(`${this.url}/find_nearest_node`, {
                headers: { 
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coords)
            });
            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Sets the user token
     * 
     * @param {string} userToken 
     */
    setToken(userToken) {
        token = userToken;
    }

}
