import UserGateway from "../gateways/UserGateway";

const STORAGE_KEY = 'jwtIdToken';

const gateway = new UserGateway();

export default async function checkUserLoggedIn() {
    const token = getUserToken();
    if (!token) return false;
    return await gateway.isValidToken();
}

export function getUserToken() {
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * Stores a given encoded user JWT `token` locally.
 * @param {string} token 
 */
export function signUserIn(token) {
    localStorage.setItem(STORAGE_KEY, token);
}

export function signUserOut() {
    if (!checkUserLoggedIn()) throw new Error('No user found!');
    localStorage.removeItem(STORAGE_KEY);
}
