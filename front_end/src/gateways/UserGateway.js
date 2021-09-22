import axios from "axios";
import userTokenExists, { getUserToken } from "../utils/AuthChecker"

const ERR_RECENTS = 'User should be logged in to view recents!'
const ERR_SPEED = 'User should be logged in to use speed!'

export default class UserGateway {

    async getRecents() {
        const loggedIn = userTokenExists();
        if (!loggedIn) throw new Error(ERR_RECENTS);
        const response = await axios.get('user/list_recents', {
            headers: { Authorization: `Bearer ${getUserToken()}` }
        });
        console.log('GET user/list_recents success');
        return response.data;
    }

    async isValidToken() {
        const token = getUserToken();
        if (!token) return false;
        try {
            const response = await axios.get('user/check_token', {
                headers: { 'Authorization': `Bearer ${getUserToken()}` }
            });
            console.log('GET user/check_token success');
            return response.data.valid === 1;
        } catch (e) {
            console.error(e);
        }
    }

    async getWalkingSpeed() {
        const loggedIn = userTokenExists();
        if (!loggedIn) throw new Error(ERR_SPEED);
        const response = await axios.get('user/get_speed', {
            headers: { 'Authorization': `Bearer ${getUserToken()}` }
        });
        console.log('GET user/get_speed success');
        return response.data;
    }

    /**
     * @param {number} newSpeed 
     * @returns 
     */
    async postWalkingSpeed(newSpeed) {
        const loggedIn = userTokenExists();
        if (!loggedIn) throw new Error(ERR_SPEED);
        const response = await axios.post('user/update_speed', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getUserToken()}`
            },
            body: { speed: newSpeed }
        });
        console.log('POST user/update_speed success');
        return response.data;
    }

}
