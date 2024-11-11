import { Router, Request, Response } from 'express';
import UserService from '../service/user.service';
import { fauxAuthMiddleware } from '../../faux-auth-middleware';

const userService = new UserService();
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try{
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.get('/', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const users = await userService.findAll();
        res.status(201).json(users);
    }catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
  
export default router;