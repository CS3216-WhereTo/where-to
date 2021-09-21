const STORAGE_KEY = 'jwtIdToken';

export default function userIsLoggedIn() {
    return localStorage.getItem(STORAGE_KEY) != null;
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
    if (!userIsLoggedIn()) throw new Error('No user found!');
    localStorage.removeItem(STORAGE_KEY);
}
