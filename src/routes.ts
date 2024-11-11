import { Router } from 'express';
import userController from './user/controller/user.controller';

const router = Router();

router.use('/users', userController);

export default router;
