import { Router } from 'express';
import userController from './user/controller/user.controller';
import walletController from './wallet/controller/wallet.controller';

const router = Router();

router.use('/users', userController);
router.use('/wallets', walletController);
 
export default router;
