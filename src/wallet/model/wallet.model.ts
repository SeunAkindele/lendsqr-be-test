const knex = require('../../knexfile');

export interface Wallet {
    user_id: number;
    balance?: number;
    status?:number;
    updated_at?: Date;
}

export default class WalletModel {
  private table = 'wallets';
  private users = 'users';

  async findAll(): Promise<Wallet[]> {
    return await knex(this.table)
            .select(`${this.table}.*`, `${this.users}.name as name`)  // Select all wallet columns + the owner's name
            .join(this.users, `${this.table}.user_id`, '=', `${this.users}.id`);
  }

  async findById(id: number): Promise<Wallet | undefined> {
    return await knex(this.table).where({ id }).first();
  }

  async findByUserId(user_id: number, trx): Promise<Wallet | undefined> {
    return await knex(this.table).transacting(trx).where({ user_id }).first();
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const [insertedId] = await knex(this.table).insert(wallet);

    const newWallet = await this.findById(insertedId);
    return newWallet!;
  }

  async update(user_id: number, wallet: Partial<Wallet>, trx): Promise<Wallet | undefined> {
    await knex(this.table).where({ user_id }).transacting(trx).update(wallet);
    return await this.findByUserId(user_id, trx);
  }
}
