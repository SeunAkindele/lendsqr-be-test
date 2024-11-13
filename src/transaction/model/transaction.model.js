var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const knex = require('../../knexfile');
export default class TransactionModel {
    constructor() {
        this.table = 'transactions';
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield knex(this.table).select('*');
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield knex(this.table).where({ id }).first();
        });
    }
    findByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield knex(this.table).where({ user_id }).first();
        });
    }
    create(transaction, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const [insertedId] = yield knex(this.table)
                .transacting(trx) // Link this insert to the transaction
                .insert(transaction);
            const newTransaction = yield knex(this.table)
                .transacting(trx) // Ensure it's within the same transaction context
                .where({ id: insertedId })
                .first();
            return newTransaction;
        });
    }
    update(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield knex(this.table).where({ id }).update(transaction);
            return yield this.findById(id);
        });
    }
}
