export default function NodesGateway() {

    const url = '{insert URL}/node';

    /**
     * Sends a GET request for all nodes.
     * 
     * @param {string} token 
     */
    async function get(token) {
        const response = await fetch(`${url}/list_nodes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json;
    }

    /**
     * Sends a GET request for the nearest node from the given coordinates.
     * 
     * @param {string} token 
     * @param {{lat: number, lon: number}} coords 
     */
     async function findNearest(token, coords) {
        const response = await fetch(`${url}/find_nearest_node`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(coords)
        })
        return response.json();
    }

    return Object.freeze({
        get,
        findNearest
    });

}
