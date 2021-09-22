import axios from "axios";
import checkUserLoggedIn, { getUserToken } from "../utils/AuthChecker"

const ERR_RECENTS = 'User should be logged in to view recents!'
const ERR_SPEED = 'User should be logged in to use speed!'

export default class UserGateway {

    async getRecents() {
        const loggedIn = await checkUserLoggedIn();
        if (!loggedIn) throw new Error(ERR_RECENTS);
        const response = await axios.get('user/list_recents', {
            headers: { Authorization: `Bearer ${getUserToken()}` }
        });
        return response.data;
    }

    async isValidToken() {
        const token = getUserToken();
        if (!token) return false;
        try {
            const response = await axios.get('user/check_token', {
                headers: { 'Authorization': `Bearer ${getUserToken()}` }
            });
            return response.data.valid === 1;
        } catch (e) {
            console.error(e);
        }
    }

    async getWalkingSpeed() {
        const loggedIn = await checkUserLoggedIn();
        if (!loggedIn) throw new Error(ERR_SPEED);
        const response = await axios.get('user/get_speed', {
            headers: { 'Authorization': `Bearer ${getUserToken()}` }
        });
        return response.data;
    }

    /**
     * @param {number} newSpeed 
     * @returns 
     */
    async postWalkingSpeed(newSpeed) {
        const loggedIn = await checkUserLoggedIn();
        if (!loggedIn) throw new Error(ERR_SPEED);
        const response = await axios.post('user/update_speed', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getUserToken()}`
            },
            body: { speed: newSpeed }
        });
        return response.data;
    }

}
