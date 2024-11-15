jest.mock('../../knexfile', () => {
    return {
        raw: jest.fn(), // mock any db methods as needed
    };
});

import UserService from "./user.service";
import MockAdapter from 'axios-mock-adapter';

const axios = require('axios');
const AxiosMockAdapter = require('axios-mock-adapter');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require("../../knexfile");

describe('UserService - checkBlacklist', () => {
    let userService: UserService;
    let mockAxios: any;

    beforeAll(() => {
        userService = new UserService(); // Instantiate UserService
        mockAxios = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
        // Reset the Axios mock after each test
        mockAxios.reset();
    });

    test('should return true if the user is blacklisted', async () => {
        const testEmail = 'blacklisted@example.com';
        
        // Mock the API response to simulate a blacklisted user
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(200, { blacklisted: true, details: "User is blacklisted" });

        const result = await userService.checkBlacklist(testEmail);
        expect(result).toBe(true);
    });

    test('should return false if the user is not blacklisted', async () => {
        const testEmail = 'notblacklisted@example.com';
        
        // Mock the API response to simulate a user who is not blacklisted
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(200, { blacklisted: false });

        const result = await userService.checkBlacklist(testEmail);
        expect(result).toBe(false);
    });

    test('should throw an error if the API call fails', async () => {
        const testEmail = 'errorcase@example.com';
        
        // Mock a failed API response
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(500, { message: 'Internal Server Error' });

        await expect(userService.checkBlacklist(testEmail)).rejects.toThrow('Failed to check blacklist status');
    });
});
