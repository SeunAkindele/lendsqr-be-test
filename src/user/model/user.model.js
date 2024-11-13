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
export default class UserModel {
    constructor() {
        this.table = 'users';
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
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield knex(this.table).where({ email }).first();
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Insert the record and get the inserted ID
            const [insertedId] = yield knex(this.table).insert(user);
            // Retrieve the new user based on the inserted ID
            const newUser = yield this.findById(insertedId);
            return newUser;
        });
    }
}
