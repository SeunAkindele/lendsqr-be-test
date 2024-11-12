import { Router, Request, Response } from 'express';
import WalletService from '../service/wallet.service';
import { fauxAuthMiddleware } from '../../faux-auth-middleware';

const walletService = new WalletService();
const router = Router();

router.post('/', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const user = await walletService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

router.get('/', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const users = await walletService.findAll();
        res.status(200).json(users);
    }catch (error) {
        console.error('Error fetching wallets:', error);
        res.status(500).json({ error: 'Failed to fetch wallets' });
    }
});
  
export default router;
