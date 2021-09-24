import UserGateway from "../gateways/UserGateway";

const STORAGE_KEY = 'jwtIdToken';

const gateway = new UserGateway();

const clearLocalToken = () => {
    localStorage.removeItem(STORAGE_KEY);
}

export async function verifyTokenIfExists() {
    if (!userTokenExists()) return false;
    if (!navigator.online) return true;
    return await gateway.isValidToken();
}

export default function userTokenExists() {
    const token = getUserToken();
    return (token != null);
}

export const getUserToken = () => {
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * Stores a given encoded user JWT `token` locally.
 * @param {string} token 
 * @param {function} onSuccess
 */
export const signUserIn = (token, onSuccess, onFailure, onError) => {
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

export const signUserOut = () => {
    clearLocalToken();
}
