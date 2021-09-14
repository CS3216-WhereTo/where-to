export default function RouteGateway() {

    const url = '{insert url}/route'

    let token = '';

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async function getRoutes(locations) {
        const response = await fetch(`${url}/find_routes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
    async function getWalking(locations) {
        const response = fetch(`${url}/find_walk_route`, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
    async function getBus(locations) {
        const response = fetch(`${url}/find_bus_route`, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
     function setToken(userToken) {
        token = userToken;
    }
    
    return Object.freeze({
        getRoutes,
        getWalking,
        getBus,
        setToken
    });

}
