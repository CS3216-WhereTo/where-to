import UserGateway from "../gateways/UserGateway";

const STORAGE_KEY = 'jwtIdToken';

const gateway = new UserGateway();

export default async function checkUserLoggedIn() {
    const token = getUserToken();
    if (!token) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
    }
    return await gateway.isValidToken();
}

export function getUserToken() {
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * Stores a given encoded user JWT `token` locally.
 * @param {string} token 
 * @param {function} onSuccess
 */
export function signUserIn(token, onSuccess, onFailure, onError) {
    localStorage.setItem(STORAGE_KEY, token);
    checkUserLoggedIn()
        .then((valid) => { if (valid) onSuccess(); else onFailure(); })
        .catch((e) => {
            console.error(e);
            onError(e);
        });
}

export function signUserOut() {
    if (!checkUserLoggedIn()) throw new Error('No user found!');
    localStorage.removeItem(STORAGE_KEY);
}
