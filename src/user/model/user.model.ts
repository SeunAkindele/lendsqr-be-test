const knex = require('../../knexfile');

export interface User {
    name: string;
    email: string;
    password: string;
    is_blacklist?: boolean;
    status?:number;
    created_at: Date;
    updated_at: Date;
}

export default class UserModel {
  private table = 'users';

  async findAll(): Promise<User[]> {
    return await knex(this.table).select('*');
  }

  async findById(id: number): Promise<User | undefined> {
    return await knex(this.table).where({ id }).first();
  }

  async create(user: User): Promise<User> {
    // Insert the record and get the inserted ID
    const [insertedId] = await knex(this.table).insert(user);

    // Retrieve the new user based on the inserted ID
    const newUser = await this.findById(insertedId);
    return newUser!;
  }
}
