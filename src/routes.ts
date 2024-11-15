import { Router } from 'express';
import userController from './user/controller/user.controller';
import walletController from './wallet/controller/wallet.controller';
import transactionController from './transaction/controller/transaction.controller';

const router = Router();

router.use('/users', userController);
router.use('/wallets', walletController);
router.use('/transactions', transactionController);
 
export default router;
