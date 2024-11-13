# MVP Wallet Service

A simple wallet service API that allows users to create accounts, deposit funds, transfer funds, and withdraw funds. This project is being built as an MVP to demonstrate basic wallet functionality. A blacklist check to prevent blacklisted users was also implemeted through integration with external services.

## Features:
- User account creation
- Fund deposit and withdrawal
- Transfer funds between users
- Prevent onboarding of users that are blacklisted on Lendsqr karma blacklist

## Technologies Used:
- NodeJS (LTS version)
- MySQL database
- KnexJS ORM
- TypeScript

## Database Design

Entity-Relationship Diagram

![Entity-Relationship Diagram](src/er-diagram.png)

## Accessing the API Endpoints:

**Base URL** `https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com`

### User
- **GET** `/api/users` - Retrieve all users
`cURL` command:
```bash
curl -X GET https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/users \
-H "Content-Type: application/json"
```

- **POST** `/api/users` - Registers all users provided they are not blacklisted
`cURL` command:
```bash
curl -X POST https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/users \
  -H "Authorization: Bearer faux-token-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "newuser",
        "email": "newuser@gmail.com",
        "password": "newuserpassword"
      }'
```

### Wallet
- **GET** `/api/wallets` - Retrieve all wallets
`cURL` command:
```bash
curl -X GET https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/wallets \
-H "Authorization: Bearer faux-token-1234567890" \
-H "Content-Type: application/json"
```

- **POST** `/api/wallets` - Creates wallet for user
`cURL` command:
```bash
curl -X POST https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/wallets \
  -H "Authorization: Bearer faux-token-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
        "user_id": 1
      }'
```

### Transaction
- **GET** `/api/transactions` - Retrieve transaction history
`cURL` command:
```bash
curl -X GET https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/transactions \
-H "Authorization: Bearer faux-token-1234567890" \
-H "Content-Type: application/json"
```

- **POST** `/api/transactions/deposit-withdrawal` - Funds wallet
`cURL` command:
```bash
curl -X POST https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/transactions/deposit-withdrawal \
  -H "Authorization: Bearer faux-token-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
         "recipient_id": 1,
         "amount": 2500,
         "transaction_type": "deposit",
         "effect": "cr"
      }'
```

- **POST** `/api/transactions/deposit-withdrawal` - Withdraws from wallet
`cURL` command:
```bash
curl -X POST https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/transactions/deposit-withdrawal \
  -H "Authorization: Bearer faux-token-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
         "recipient_id": 1,
         "amount": 2000,
         "transaction_type": "withdrawal",
         "effect": "dr"
      }'
```

- **POST** `/api/transactions/deposit-withdrawal` - Transfer funds to another user's wallet
`cURL` command:
```bash
curl -X POST https://oluwaseun-lendsqr-be-test-4c4a8256975c.herokuapp.com/api/transactions/transfer \
  -H "Authorization: Bearer faux-token-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
         "sender_id": 1,
         "recipient_id": 2,
         "amount": 3000,
         "transaction_type": "transfer"
      }'
```
