export default class UserGateway {
    
    async getRecents() {
        return { nodes: [6, 13] };
    }

    async isValidToken() {
        return true;
    }

    async getWalkingSpeed() {
        return { speed: 4 };
    }

    async postWalkingSpeed() {
        return { error: 0 };
    }

}
