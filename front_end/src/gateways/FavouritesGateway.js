import axios from "axios";
import userIsLoggedIn, { getUserToken } from "../utils/AuthChecker";

export default class FavouritesGateway {

    /**
     * Sends a GET request for the user's favourited locations.
     */
    async get() {
        const headers = {};
        if (!userIsLoggedIn()) {
            throw new Error('User should be logged in to use favourites!');
        }

        headers['Authorization'] = `Bearer ${getUserToken()}`;
        try {
            const response = await axios.get('favourites/list_favourites', {
                headers: headers
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
        const headers = { 'Content-Type': 'application/json' };
        if (!userIsLoggedIn()) {
            throw new Error('User should be logged in to use favourites!');
        }

        headers['Authorization'] = `Bearer ${getUserToken()}`;
        try {
            const response = await axios.post('favourites/add_favourite', {
                headers: headers,
                params: { node_id: nodeId }
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
        const headers = { 'Content-Type': 'application/json' };
        if (!userIsLoggedIn()) {
            throw new Error('User should be logged in to use favourites!');
        }

        headers['Authorization'] = `Bearer ${getUserToken()}`;
        try {
            const response = await axios.post('favourites/remove_favourite', {
                headers: headers,
                data: { node_id: nodeId }
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
        
    }

}
