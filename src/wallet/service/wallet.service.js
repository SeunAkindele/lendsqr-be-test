var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WalletModel from "../model/wallet.model";
const knex = require('../../knexfile');
export default class WalletService {
    constructor() {
        this.walletModel = new WalletModel();
    }
    create(walletData) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield knex.transaction();
            try {
                const wallet = yield this.findByUserId(walletData.user_id, trx);
                if (wallet) {
                    return 'You already created a wallet with this account.';
                }
                return yield this.walletModel.create(walletData);
            }
            catch (error) {
                console.error("Error creating wallet: ", error);
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.walletModel.findAll();
            }
            catch (error) {
                console.error("Error creating wallet: ", error);
                throw error;
            }
        });
    }
    findByUserId(id, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.walletModel.findByUserId(id, trx);
        });
    }
    update(id, walletData, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.walletModel.update(id, walletData, trx);
            }
            catch (error) {
                console.error("Error updating wallet: ", error);
                throw error;
            }
        });
    }
}
