export default function NodesGateway() {

    const url = '{insert URL}/node';
    
    let token = '';

    /**
     * Sends a GET request for all nodes.
     */
    async function get() {
        const response = await fetch(`${url}/list_nodes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json;
    }

    /**
     * Sends a GET request for the nearest node from the given coordinates.
     * 
     * @param {{lat: number, lon: number}} coords 
     */
    async function findNearest(coords) {
        const response = await fetch(`${url}/find_nearest_node`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(coords)
        })
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
        findNearest,
        setToken
    });

}
