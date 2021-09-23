import UserGateway from "../gateways/UserGateway";

const STORAGE_KEY = 'jwtIdToken';

const gateway = new UserGateway();

function clearLocalToken() {
    localStorage.removeItem(STORAGE_KEY);
}

export async function verifyTokenIfExists() {
    if (!userTokenExists()) return false;
    return await gateway.isValidToken();
}

export default function userTokenExists() {
    const token = getUserToken();
    return (token != null);
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
    return verifyTokenIfExists()
        .then((valid) => {
            if (valid) onSuccess();
            else {
                clearLocalToken();
                onFailure();
            }
        })
        .catch((e) => {
            console.error(e);
            clearLocalToken();
            onError(e);
        });
}

export function signUserOut() {
    clearLocalToken();
}
