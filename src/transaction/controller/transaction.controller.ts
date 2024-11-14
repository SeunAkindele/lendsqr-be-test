import { Router, Request, Response } from 'express';
import TransactionService from '../service/transaction.service';
import { fauxAuthMiddleware } from '../../faux-auth-middleware';
import { BadRequestError } from '../../error/bad-request';

const transactionService = new TransactionService();
const router = Router();

router.post('/deposit-withdrawal', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const user = await transactionService.transact(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof BadRequestError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error funding wallet:', error);
            res.status(500).json({ error: error.message });
        }
    }
});

router.post('/transfer', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const user = await transactionService.transfer(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof BadRequestError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error transferring funds:', error);
            res.status(500).json({ error: error.message });
        }
    }
});

router.get('/', fauxAuthMiddleware, async (req: Request, res: Response) => {
    try{
        const users = await transactionService.findAll();
        res.status(200).json(users);
    }catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ error: error.message });
    }
});
  
export default router;
