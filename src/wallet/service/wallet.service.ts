import UserModel from "../../user/model/user.model";
import { BadRequestError } from "../../error/bad-request";
import WalletModel, { Wallet } from "../model/wallet.model";
const knex = require('../../knexfile');

export default class WalletService {
    private walletModel: WalletModel;
    private userModel: UserModel;

    constructor() {
        this.walletModel = new WalletModel();
        this.userModel = new UserModel();
    }
 
    async create(walletData: Wallet): Promise<Wallet | string> {
        if (!walletData.user_id) {
            throw new BadRequestError('No user account was provideds');
        }
        const trx = await knex.transaction();
        try {
            const user = await this.userModel.findById(walletData.user_id);
            if(!user) {
                throw new BadRequestError('This accout does not exist.');
            }
            const wallet = await this.findByUserId(walletData.user_id, trx);
            if(wallet) {
                throw new BadRequestError('You already created a wallet with this account.');
            }
            return await this.walletModel.create(walletData);
        } catch(error) {
            console.error("Error creating wallet: ", error);
            throw error;
        }
    }

    async findAll(): Promise<Wallet[]> {
        try {
            return await this.walletModel.findAll();
        } catch(error) {
            console.error("Error creating wallet: ", error);
            throw error;
        }
    }

    async findByUserId(id: number, trx): Promise<Wallet | undefined> {
        return await this.walletModel.findByUserId(id, trx);
    }

    async update(id: number, walletData: Wallet, trx): Promise<Wallet> {
        try {
            return await this.walletModel.update(id, walletData, trx);
        } catch(error) {
            console.error("Error updating wallet: ", error);
            throw error;
        }
    }
}
