export default function FavouritesGateway() {

    const url = '{insert URL here}/favourites';

    let token = '';

    /**
     * Sends a GET request for the user's favourited locations.
     */
    async function get() {
        const response = await fetch(`${url}/list_favourites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json;
    }

    /**
     * Sends a POST request to add a location to the user's favourites.
     * 
     * @param {number} nodeId
     */
    async function add(nodeId) {
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
     * @param {number} nodeId
     */
    async function remove(nodeId) {
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

    /**
     * Sets the user token
     * 
     * @param {string} userToken 
     */
     function setToken(userToken) {
        token = userToken;
    }

    return Object.freeze({
        get,
        add,
        remove,
        setToken
    });

}
