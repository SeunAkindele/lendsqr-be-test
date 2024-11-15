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
  private users = 'users';

  async findAll(): Promise<Transaction[]> {
    return await knex(this.table)
            .select(
              `${this.table}.*`,                    // Select all transaction columns
                'sender.name as sender',           // Sender's name (if exists)
                'recipient.name as recipient'      // Recipient's name
            )
            .leftJoin(`${this.users} as sender`, `${this.table}.sender_id`, '=', 'sender.id')  // Left join for sender_id (may be null)
            .join(`${this.users} as recipient`, `${this.table}.recipient_id`, '=', 'recipient.id');  // Join for recipient_id (never null)
   
  }

  async findById(id: number): Promise<Transaction | undefined> {
    return await knex(this.table).where({ id }).first();
  }

  async findByUserId(user_id: number): Promise<Transaction | undefined> {
    return await knex(this.table).where({ user_id }).first();
  }

  async create(transaction: Transaction, trx:any): Promise<Transaction> {
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
