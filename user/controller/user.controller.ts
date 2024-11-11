import { UserService } from "../service/user.service";


export class UserController {

    constructor(){}

    async create(req, res): Promise<void> {
        const userService = new UserService();
        
        try {
            // const userData: UserData = req.body;
            // const user = await this.userService.create(userData);

            // res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
}
