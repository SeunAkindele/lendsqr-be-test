var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from "../model/user.model";
const axios = require('axios');
export default class UserService {
    constructor() {
        this.userModel = new UserModel();
    }
    // using Lendsqr Adjutor Karma blacklist api
    checkBlacklist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.get(`${process.env.KARMA_BLACKLIST_API_URL}`, {
                    params: {
                        identifier: email,
                    },
                    headers: {
                        'API-ID': process.env.ADJUTOR_API_ID,
                        'API-SECRET': process.env.ADJUTOR_API_SECRET_KEY,
                    },
                });
                if (response.data.blacklisted) {
                    console.log(`User is blacklisted: ${response.data.details}`);
                    return true;
                }
                else {
                    console.log(`User is not blacklisted: ${response.data}`);
                    return false;
                }
            }
            catch (error) {
                console.error('Error checking blacklist:', error.response ? error.response.data : error.message);
                throw new Error('Failed to check blacklist status');
            }
        });
    }
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // checking if user is blacklisted
                const isUserBlacklisted = yield this.checkBlacklist(userData.email);
                if (isUserBlacklisted) {
                    return `This user is in the Lendsqr Adjutor Karma blacklist and cannot onboard`;
                }
                const user = yield this.findByEmail(userData.email);
                if (user) {
                    return 'This email already exist';
                }
                const newUser = yield this.userModel.create(userData);
                return { user: newUser, token: 'faux-token-1234567890!' };
            }
            catch (error) {
                console.error("Error creating user: ", error);
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel.findAll();
            }
            catch (error) {
                console.error("Error creating user: ", error);
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findByEmail(email);
        });
    }
}
