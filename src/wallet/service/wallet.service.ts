import WalletModel, { Wallet } from "../model/wallet.model";

export default class WalletService {
    private walletModel: WalletModel;

    constructor() {
        this.walletModel = new WalletModel();
    }
 
    async create(walletData: Wallet): Promise<Wallet | string> {
        try {
            const wallet = await this.findByUserId(walletData.user_id);
            if(wallet) {
                return 'You already created a wallet with this account.';
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

    async findByUserId(id: number): Promise<Wallet | undefined> {
        return await this.walletModel.findByUserId(id);
    }

    async update(id: number, walletData: Wallet): Promise<Wallet> {
        try {
            return await this.walletModel.update(id, walletData);
        } catch(error) {
            console.error("Error updating wallet: ", error);
            throw error;
        }
    }
}
