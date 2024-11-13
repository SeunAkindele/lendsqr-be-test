var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WalletModel from "../../wallet/model/wallet.model";
import TransactionModel from "../model/transaction.model";
const knex = require('../../knexfile');
export default class TransactionService {
    constructor() {
        this.transactionModel = new TransactionModel();
        this.walletModel = new WalletModel();
    }
    transactionId() {
        return __awaiter(this, void 0, void 0, function* () {
            const min = 100000;
            const max = 999999;
            const token = Math.floor(Math.random() * (max - min + 1)) + min;
            return token.toString();
        });
    }
    processDepostiWithdrawal(wallet, newTransaction, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "deposit") {
                return Number(wallet.balance) + Number(newTransaction.amount);
            }
            if (type === "withdrawal") {
                return Number(wallet.balance) - Number(newTransaction.amount);
            }
        });
    }
    validateWallet(id, trx, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = yield this.walletModel.findByUserId(id, trx);
            if (!wallet) {
                throw new Error(message);
            }
            return wallet;
        });
    }
    validateBalance(id, amount, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = yield this.walletModel.findByUserId(id, trx);
            if (wallet.balance < amount) {
                throw new Error("Wallet has insufficient funds");
            }
            return true;
        });
    }
    transact(transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transaction_type, amount, recipient_id } = transactionData;
            const trx = yield knex.transaction();
            try {
                let wallet = yield this.validateWallet(recipient_id, trx, "Wallet not found");
                if (transaction_type === "withdrawal") {
                    yield this.validateBalance(recipient_id, amount, trx);
                }
                const token = yield this.transactionId();
                const newTransaction = yield this.transactionModel.create(Object.assign(Object.assign({}, transactionData), { token }), trx);
                // Checks if transaction type is deposit or withdrawal and gets wallet balance
                const walletBalance = yield this.processDepostiWithdrawal(wallet, newTransaction, transaction_type);
                // throw new Error("Simulated error before wallet update to check if rollback works");
                const updated_at = new Date();
                yield this.walletModel.update(recipient_id, { balance: walletBalance, updated_at }, trx);
                // throw new Error("Simulated error after wallet update to check if rollback works");
                // Commit the transaction if both db writings succeed
                yield trx.commit();
                return newTransaction;
            }
            catch (error) {
                yield trx.rollback();
                console.error("Error funding wallet: ", error);
                throw error;
            }
        });
    }
    debitSender(transactionData, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sender_id, amount } = transactionData;
            const wallet = yield this.validateWallet(sender_id, trx, "Wallet not found");
            yield this.validateBalance(sender_id, amount, trx);
            const token = yield this.transactionId();
            const transaction = yield this.transactionModel.create(Object.assign(Object.assign({}, transactionData), { token, effect: 'dr' }), trx);
            const updated_at = new Date();
            const walletBalance = Number(wallet.balance) - Number(transaction.amount);
            yield this.walletModel.update(sender_id, { balance: walletBalance, updated_at }, trx);
            return transaction;
        });
    }
    creditRecipient(transactionData, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recipient_id } = transactionData;
            const wallet = yield this.validateWallet(recipient_id, trx, "Recipient wallet not found");
            const token = yield this.transactionId();
            const transaction = yield this.transactionModel.create(Object.assign(Object.assign({}, transactionData), { token, effect: 'cr' }), trx);
            const updated_at = new Date();
            const walletBalance = Number(wallet.balance) + Number(transaction.amount);
            yield this.walletModel.update(recipient_id, { balance: walletBalance, updated_at }, trx);
        });
    }
    transfer(transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield knex.transaction();
            try {
                // processes sender transaction
                const transaction = yield this.debitSender(transactionData, trx);
                // throw new Error("Simulated error before wallet update to check if rollback works");
                // processes recipient transaction
                yield this.creditRecipient(transactionData, trx);
                // throw new Error("Simulated error before wallet update to check if rollback works");
                // Commit the transaction if all db writings succeed
                yield trx.commit();
                return transaction;
            }
            catch (error) {
                console.error("Error transferring funds: ", error);
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transactionModel.findAll();
            }
            catch (error) {
                console.error("Error fetching transaction history: ", error);
                throw error;
            }
        });
    }
}
