import UserModel, { User } from "../model/user.model";

export default class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }
 
    async create(userData: User): Promise<User | string> {
        try {
            const user = await this.findByEmail(userData.email);
            if(user) {
                return 'This email already exist';
            }
            return await this.userModel.create(userData);
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
