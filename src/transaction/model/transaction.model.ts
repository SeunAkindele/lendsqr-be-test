const knex = require('../../knexfile');

export interface Transaction {
    sender_id?: number;
    recipient_id: number;
    token: string;
    amount: number;
    transaction_type: string;
    effect?: string;
    status?:number;
}

export default class TransactionModel {
  private table = 'transactions';

  async findAll(): Promise<Transaction[]> {
    return await knex(this.table).select('*');
  }

  async findById(id: number): Promise<Transaction | undefined> {
    return await knex(this.table).where({ id }).first();
  }

  async findByUserId(user_id: number): Promise<Transaction | undefined> {
    return await knex(this.table).where({ user_id }).first();
  }

  async create(transaction: Transaction, trx): Promise<Transaction> {
    const [insertedId] = await knex(this.table)
            .transacting(trx) // Link this insert to the transaction
            .insert(transaction);

    const newTransaction = await knex(this.table)
            .transacting(trx) // Ensure it's within the same transaction context
            .where({ id: insertedId })
            .first();
    return newTransaction!;
  }

  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined> {
    await knex(this.table).where({ id }).update(transaction);
    return await this.findById(id);
  }
}
