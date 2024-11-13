var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import TransactionService from '../service/transaction.service';
import { fauxAuthMiddleware } from '../../faux-auth-middleware';
const transactionService = new TransactionService();
const router = Router();
router.post('/deposit-withdrawal', fauxAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield transactionService.transact(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error funding wallet:', error);
        res.status(500).json({ error: error.message });
    }
}));
router.post('/transfer', fauxAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield transactionService.transfer(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error transferring funds:', error);
        res.status(500).json({ error: error.message });
    }
}));
router.get('/', fauxAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield transactionService.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ error: error.message });
    }
}));
export default router;
