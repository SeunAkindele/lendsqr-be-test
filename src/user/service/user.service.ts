import UserModel, { User } from "../model/user.model";
const axios = require('axios');

export default class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    // using Lendsqr Adjutor Karma blacklist api
    async checkBlacklist(email) {
        try {
            const response = await axios.get(`${process.env.KARMA_BLACKLIST_API_URL}`, {
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
            } else {
                console.log(`User is not blacklisted: ${response.data}`);
                return false;
            }
        } catch (error) {
            console.error('Error checking blacklist:', error.response ? error.response.data : error.message);
            throw new Error('Failed to check blacklist status');
        }
    }
 
    async create(userData: User): Promise<{user: User, token: string} | string> {
        try {
            // checking if user is blacklisted
            const isUserBlacklisted = await this.checkBlacklist(userData.email);
            if(isUserBlacklisted) {
                return `This user is in the Lendsqr Adjutor Karma blacklist and cannot onboard`;
            }
            
            const user = await this.findByEmail(userData.email);
            if(user) {
                return 'This email already exist';
            }
            const newUser = await this.userModel.create(userData);
            return {user: newUser, token: 'faux-token-1234567890!'};
        } catch(error) {
            console.error("Error creating user: ", error);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.findAll();
        } catch(error) {
            console.error("Error creating user: ", error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userModel.findByEmail(email);
    }
}
