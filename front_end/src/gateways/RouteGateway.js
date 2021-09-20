const axios = require('axios').default;

export default class RouteGateway {

    constructor() {
        this.token = '';
    }

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async getRoutes(locations) {
        try {
            const response = await axios.get('route/find_routes', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: locations
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Sends a GET request for only walking routes.
     * 
     * @param {{start_id: number, end_id: number}} locations  
     */
    async getWalking(locations) {
        try {
            const response = axios.get('route/find_walk_route', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: locations
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Sends a GET request for only bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations
     */
    async getBus(locations) {
        try {
            const response = await axios.get('route/find_bus_route', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: locations
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
        this.token = userToken;
    }

}
