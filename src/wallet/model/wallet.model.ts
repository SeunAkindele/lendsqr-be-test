const knex = require('../../knexfile');

export interface Wallet {
    user_id: number;
    balance?: number;
    status?:number;
}

export default class WalletModel {
  private table = 'wallets';

  async findAll(): Promise<Wallet[]> {
    return await knex(this.table).select('*');
  }

  async findById(id: number): Promise<Wallet | undefined> {
    return await knex(this.table).where({ id }).first();
  }

  async findByUserId(user_id: number): Promise<Wallet | undefined> {
    return await knex(this.table).where({ user_id }).first();
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const [insertedId] = await knex(this.table).insert(wallet);

    const newWallet = await this.findById(insertedId);
    return newWallet!;
  }

  async update(id: number, wallet: Partial<Wallet>): Promise<Wallet | undefined> {
    await knex(this.table).where({ id }).update(wallet);
    return await this.findById(id);
  }
}
