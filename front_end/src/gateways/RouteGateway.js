export default class RouteGateway {

    constructor() {
        this.url = '{insert URL}/route';
        this.token = '';
    }

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async getRoutes(locations) {
        const response = await fetch(`${this.url}/find_routes`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locations)
        });
        return response.json();
    }

    /**
     * Sends a GET request for only walking routes.
     * 
     * @param {{start_id: number, end_id: number}} locations  
     */
    async getWalking(locations) {
        const response = fetch(`${this.url}/find_walk_route`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locations)
        });
        return response.json();
    }

    /**
     * Sends a GET request for only bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations
     */
    async getBus(locations) {
        const response = fetch(`${this.url}/find_bus_route`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locations)
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
