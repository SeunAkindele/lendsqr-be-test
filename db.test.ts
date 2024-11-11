const knexfile = require('./src/knexfile');
jest.mock('knexfile');

describe('Database Connection', () => {
  it('should call knex with correct parameters', () => {
    // Mock knex.createConnection to avoid actual DB connection
    const mockKnexInstance = { connect: jest.fn() };
    knex.createConnection.mockReturnValue(mockKnexInstance);

    expect(knex.createConnection).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
  });

  it('should handle connection errors', () => {
    // Simulate a failed connection
    const mockKnexInstance = { connect: jest.fn((cb) => cb(new Error('Connection failed'))) };
    knex.createConnection.mockReturnValue(mockKnexInstance);

    const db = require('./src/knexfile');

    console.error = jest.fn();
    db;

    expect(console.error).toHaveBeenCalledWith('Database connection failed:', expect.any(Error));
  });

  it('should log successful connection', () => {
    // Simulate a successful connection
    const mockKnexInstance = { connect: jest.fn((cb) => cb(null)) };
    knex.createConnection.mockReturnValue(mockKnexInstance);

    const db = require('./src/knexfile');

    console.log = jest.fn();
    db;
    
    expect(console.log).toHaveBeenCalledWith('Connected to the database.');
  });
});
