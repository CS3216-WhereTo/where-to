export default class FavouritesGateway {

    constructor() {
        this.token = '';
        this.url = '{insert URL here}/favourites';
    }

    /**
     * Sends a GET request for the user's favourited locations.
     */
    async get() {
        const response = await fetch(`${this.url}/list_favourites`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        return response.json;
    }

    /**
     * Sends a POST request to add a location to the user's favourites.
     * 
     * @param {number} nodeId
     */
    async add(nodeId) {
        const response = await fetch(`${this.url}/add_favourite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ node_id: nodeId })
        });
        return response.json();
    }

    /**
     * Sends a POST request to remove a location from the user's favourites.
     * 
     * @param {number} nodeId
     */
    async remove(nodeId) {
        const response = await fetch(`${this.url}/remove_favourite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ node_id: nodeId })
        });
        return response.json();
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
