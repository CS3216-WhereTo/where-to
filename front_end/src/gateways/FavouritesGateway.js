export default function FavouritesGateway() {

    const url = '{insert URL here}/favourites';

    /**
     * Sends a GET request for the user's favourited locations.
     * 
     * @param {string} token 
     */
    async function get(token) {
        const response = await fetch(`${url}/list_favourites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json;
    }

    /**
     * Sends a POST request to add a location to the user's favourites.
     * 
     * @param {string} token
     * @param {number} nodeId
     */
    async function add(token, nodeId) {
        const response = await fetch(`${url}/add_favourite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ node_id: nodeId })
        });
        return response.json();
    }

    /**
     * Sends a POST request to remove a location from the user's favourites.
     * 
     * @param {string} token
     * @param {number} nodeId
     */
    async function remove(token, nodeId) {
        const response = await fetch(`${url}/remove_favourite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ node_id: nodeId })
        });
        return response.json();
    }

    return Object.freeze({
        get,
        add,
        remove
    });

}
