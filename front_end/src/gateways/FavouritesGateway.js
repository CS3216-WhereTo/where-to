import axios from "axios";
import userTokenExists, { getUserToken } from "../utils/AuthChecker";

export default class FavouritesGateway {

    /**
     * Sends a GET request for the user's favourited locations.
     */
    async get() {
        const loggedIn = userTokenExists();
        if (!loggedIn) {
            throw new Error('User should be logged in to use favourites!');
        }

        const headers = { 'Authorization': `Bearer ${getUserToken()}`};
        try {
            const response = await axios.get('favourites/list_favourites', {
                headers: headers
            });
            console.log('GET favourites/list_favourites success');
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
        const loggedIn = userTokenExists();
        if (!loggedIn) {
            throw new Error('User should be logged in to use favourites!');
        }

        headers['Authorization'] = `Bearer ${getUserToken()}`;
        try {
            const response = await axios.post('favourites/add_favourite', {
                headers: headers,
                data: { node_id: nodeId }
            });
            console.log('POST favourites/add_favourites success');
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
        const loggedIn = userTokenExists();
        if (!loggedIn) {
            throw new Error('User should be logged in to use favourites!');
        }

        headers['Authorization'] = `Bearer ${getUserToken()}`;
        try {
            const response = await axios.post('favourites/remove_favourite', {
                headers: headers,
                data: { node_id: nodeId }
            });
            console.log('POST favourites/remove_favourite success');
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
        
    }

}
