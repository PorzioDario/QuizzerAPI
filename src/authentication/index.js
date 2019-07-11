import 'dotenv/config';
import uuidv1 from 'uuid/v1';

let ActiveUsers = [];

const getUserByToken = (token) => {
    const cookie = ActiveUsers.find(c => c.token === token);
    if(!cookie){
        return 'Token not valid';
    } else {
        if(cookie.expirationDate < new Date()) {
            return 'Token expired';
        } else {
            return cookie.userId;
        }
    }
};

const getTokenForUser = (userId) => {
    const cookie = ActiveUsers.find(c => c.userId === userId);

    if(cookie) {
        if(cookie.expirationDate < new Date()) {
            // token scaduto occorre cancellarlo e crearne uno nuovo
            ActiveUsers = ActiveUsers.filter(c => c.userId !== userId);
            const newToken = uuidv1();
            ActiveUsers.push({
                token: newToken,
                userId: userId,
                expirationDate: new Date().getTime() + process.env.TOKEN_DURATION
            });
            return newToken;
        } else {
            return cookie.token;
        }
    } else {
        const newToken = uuidv1();
        ActiveUsers.push({
            token: newToken,
            userId: userId,
            expirationDate: new Date(new Date().getTime() + process.env.TOKEN_DURATION)
        });
        return newToken;
    }
}

const removeToken = (token) => {
    const cookie = ActiveUsers.find(c => c.token === token);
    if(cookie) {
        ActiveUsers.pop(cookie);
        return cookie.userId;
    } else {
        return null;
    }
}

const cleanExpriredTokens = () => {
    const now = new Date();
    ActiveUsers = ActiveUsers.filter(c => c.expirationDate < now);
}

export default {
    getUserByToken,
    getTokenForUser,
    cleanExpriredTokens,
    removeToken
};