import { BadRequestError } from "../../error/bad-request";
import WalletModel from "../../wallet/model/wallet.model";
import TransactionModel, { Transaction } from "../model/transaction.model";

const knex = require('../../knexfile');

export default class TransactionService {
    private transactionModel: TransactionModel;
    private walletModel: WalletModel;

    constructor() {
        this.transactionModel = new TransactionModel();
        this.walletModel = new WalletModel();
    }

    async transactionId() {
        const min = 100000;
        const max = 999999;
        const token = Math.floor(Math.random() * (max - min + 1)) + min;
        return token.toString();
      }
    
    async processDepostiWithdrawal(wallet, newTransaction, type) {
        if(type === "deposit"){
            return Number(wallet.balance) + Number(newTransaction.amount);
        }
        if( type === "withdrawal") {
            return Number(wallet.balance) - Number(newTransaction.amount);        
        }
    }

    async validateWallet(id, trx, message) {
        let wallet = await this.walletModel.findByUserId(id, trx);
        if (!wallet) {
            throw new BadRequestError(message);
        }
        return wallet;
    }

    async validateBalance(id, amount,  trx) {
        let wallet = await this.walletModel.findByUserId(id, trx);
        if (wallet.balance < amount) {
            throw new BadRequestError("Wallet has insufficient funds");
        }
        return true;
    }

    // Input validation
    async validateInput(transactionData): Promise<void> {
        // Check if transaction type is provided
        if (!transactionData.transaction_type) {
            throw new BadRequestError('Transaction type not provided');
        }

        // Validate transfer-specific fields
        if (transactionData.transaction_type === "transfer") {
            if (!transactionData.sender_id || !transactionData.recipient_id || !transactionData.amount) {
                throw new BadRequestError('All fields (sender, recipient, amount, effect) must be filled for transfer');
            }
        } else {
            // Validate other transaction types (e.g., deposit/withdrawal)
            if (!transactionData.recipient_id || !transactionData.amount || !transactionData.effect) {
                throw new BadRequestError('All fields (recipient, amount, effect) must be filled for this transaction');
            }
        }
    }
 
    async transact(transactionData: Transaction): Promise<Transaction> {
        await this.validateInput(transactionData);
        const {transaction_type, amount, recipient_id} = transactionData;
        
        const trx = await knex.transaction();
        try {
            let wallet = await this.validateWallet(recipient_id, trx, "Wallet not found");

            if(transaction_type === "withdrawal"){
                await this.validateBalance(recipient_id, amount, trx);
            }

            const token = await this.transactionId();
            const newTransaction = await this.transactionModel.create({...transactionData, token}, trx);
            
            // Checks if transaction type is deposit or withdrawal and gets wallet balance
            const walletBalance = await this.processDepostiWithdrawal(wallet, newTransaction, transaction_type);

            // throw new Error("Simulated error before wallet update to check if rollback works");
            
            const updated_at = new Date();
            await this.walletModel.update(recipient_id, {balance: walletBalance, updated_at }, trx);

            // throw new Error("Simulated error after wallet update to check if rollback works");

            // Commit the transaction if both db writings succeed
            await trx.commit();
            return newTransaction;
        } catch(error) {
            await trx.rollback();
            console.error("Error funding wallet: ", error);
            throw error;
        }
    }

    async debitSender(transactionData, trx) {
        const {sender_id, amount} = transactionData;

        const wallet = await this.validateWallet(sender_id, trx, "Wallet not found");
        await this.validateBalance(sender_id, amount, trx);

        const token = await this.transactionId();
        const transaction = await this.transactionModel.create({...transactionData, token, effect: 'dr'}, trx);

        const updated_at = new Date();
        const walletBalance = Number(wallet.balance) - Number(transaction.amount);
        await this.walletModel.update(sender_id, {balance: walletBalance, updated_at }, trx);

        return transaction;
    }

    async creditRecipient(transactionData, trx) {
        const {recipient_id} = transactionData;

        const wallet = await this.validateWallet(recipient_id, trx, "Recipient wallet not found");

        const token = await this.transactionId();
        const transaction = await this.transactionModel.create({...transactionData, token, effect: 'cr'}, trx);

        const updated_at = new Date();
        const walletBalance = Number(wallet.balance) + Number(transaction.amount);
        await this.walletModel.update(recipient_id, {balance: walletBalance, updated_at }, trx);
    }

    async transfer(transactionData: Transaction): Promise<Transaction | string> {
        await this.validateInput(transactionData);
        const trx = await knex.transaction();
        try {
            
            // processes sender transaction
            const transaction = await this.debitSender(transactionData, trx);

            // throw new Error("Simulated error before wallet update to check if rollback works");

            // processes recipient transaction
            await this.creditRecipient(transactionData, trx);

            // throw new Error("Simulated error before wallet update to check if rollback works");
            
            // Commit the transaction if all db writings succeed
            await trx.commit();

            return transaction;
        } catch(error) {
            await trx.rollback();
            console.error("Error transferring funds: ", error);
            throw error;
        }
    }

    async findAll(): Promise<Transaction[]> {
        try {
            return await this.transactionModel.findAll();
        } catch(error) {
            console.error("Error fetching transaction history: ", error);
            throw error;
        }
    }
}
