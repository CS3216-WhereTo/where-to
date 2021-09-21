import axios from "axios";
import userIsLoggedIn, { getUserToken } from "../utils/AuthChecker";

export default class RouteGateway {

    /**
     * Sends a GET request for both walking and bus routes.
     * 
     * @param {{start_id: number, end_id: number}} locations 
     */
    async getRoutes(locations) {
        const headers = { 'Content-Type': 'application/json' };
        if (userIsLoggedIn()) headers['Authorization'] = `Bearer ${getUserToken()}`
        try {
            const response = await axios.get('route/find_routes', {
                headers: headers,
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
        const headers = { 'Content-Type': 'application/json' };
        if (userIsLoggedIn()) headers['Authorization'] = `Bearer ${getUserToken()}`
        try {
            const response = axios.get('route/find_walk_route', {
                headers: headers,
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
        const headers = { 'Content-Type': 'application/json' };
        if (userIsLoggedIn()) headers['Authorization'] = `Bearer ${getUserToken()}`
        try {
            const response = await axios.get('route/find_bus_route', {
                headers: headers,
                body: locations
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}
