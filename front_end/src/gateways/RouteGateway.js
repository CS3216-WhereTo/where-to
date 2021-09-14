import internal from "stream";

export default function RouteGateway() {

    const url = '{insert url}/route'

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {string} token 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async function getRoutes(token, locations) {
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
     * @param {string} token 
     * @param {{start_id: number, end_id: number}} locations  
     */
    async function getWalking(token, locations) {
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
     * @param {string} token 
     * @param {{start_id: number, end_id: number}} locations
     */
    async function getBus(token, locations) {
        const response = fetch(`${url}/find_bus_route`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locations)
        });
        return response.json();
    }
    
    return Object.freeze({
        getRoutes,
        getWalking,
        getBus
    });

}
