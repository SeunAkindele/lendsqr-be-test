interface UserData {
    name: string;
    email: string;
    password: string;
    is_blacklist: number;
    created_at: Date;
    updated_at: Date;
}

interface UserLogin {
    email: string;
    password: string;
}

export class UserService {

    constructor() {}

    async create(userData: UserData): Promise<UserData> {
        try {
            const user = await knex('users').insert(userData);
            return user;
        } catch(error) {
            console.error("Error creating user: ", error);
            throw error;
        }
    }

    async login(userData: UserLogin) {
        try {
            
        } catch(error) {
            console.error("Error signing in: ", error);
            throw error;
        }
    }
}
