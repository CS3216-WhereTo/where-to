import axios from "axios";
import userTokenExists, { getUserToken } from "../utils/AuthChecker";

export default class RouteGateway {

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async getRoutes(locations) {
        const headers = { 'Content-Type': 'application/json' };
        const loggedIn = userTokenExists();
        if (loggedIn) headers['Authorization'] = `Bearer ${getUserToken()}`
        const response = await axios.get('route/find_routes', {
            headers: headers,
            params: locations
        });
        console.log('GET route/find_routes success');
        return response.data;
    }

    /**
     * Sends a GET request for only walking routes.
     * 
     * @param {{start_id: number, end_id: number}} locations  
     */
    async getWalking(locations) {
        const headers = { 'Content-Type': 'application/json' };
        const loggedIn = userTokenExists();
        if (loggedIn) headers['Authorization'] = `Bearer ${getUserToken()}`
        const response = axios.get('route/find_walk_route', {
            headers: headers,
            params: locations
        });
        console.log('GET route/find_walk_route success');
        return response.data;
    }

    /**
     * Sends a GET request for only bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations
     */
    async getBus(locations) {
        const headers = { 'Content-Type': 'application/json' };
        const loggedIn = userTokenExists();
        if (loggedIn) headers['Authorization'] = `Bearer ${getUserToken()}`
        const response = await axios.get('route/find_bus_route', {
            headers: headers,
            params: locations
        });
        console.log('GET route/find_bus_route success');
        return response.data;
    }

}
