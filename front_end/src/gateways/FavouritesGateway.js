const axios = require('axios').default;

export default class FavouritesGateway {

    constructor() {
        this.token = '';
    }

    /**
     * Sends a GET request for the user's favourited locations.
     */
    async get() {
        try {
            const response = await axios.get('favourites/list_favourites', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Sends a POST request to add a location to the user's favourites.
     * 
     * @param {number} nodeId
     */
    async add(nodeId) {
        try {
            const response = await axios.post('favourites/add_favourite', {
                headers: { 
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json' 
                },
                data: { node_id: nodeId }
            })
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Sends a POST request to remove a location from the user's favourites.
     * 
     * @param {number} nodeId
     */
    async remove(nodeId) {
        try {
            const response = await axios.post('favourites/remove_favourite', {
                headers: { 
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json' 
                },
                data: { node_id: nodeId }
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
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
