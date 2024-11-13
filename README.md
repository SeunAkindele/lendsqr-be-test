# MVP Wallet Service

A simple wallet service API that allows users to create accounts, deposit funds, transfer funds, and withdraw funds. This project is being built as part of an MVP to demonstrate basic wallet functionality.

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

## Accessing the API Endpoints:

Base URL

https://oluwaseun-lendsqr-be-test.heroku.com

User

- GET /users
- POST /users

Wallet

- GET /wallets
- POST /wallets

Transaction

- GET /transactions
- POST /deposit-withdrawal

## Testing
```bash
   npm test