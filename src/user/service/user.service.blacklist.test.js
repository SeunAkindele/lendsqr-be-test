var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
jest.mock('../../knexfile', () => {
    return {
        raw: jest.fn(), // mock any db methods as needed
    };
});
import UserService from "./user.service";
const axios = require('axios');
const AxiosMockAdapter = require('axios-mock-adapter');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require("../../knexfile");
describe('UserService - checkBlacklist', () => {
    let userService;
    let mockAxios;
    beforeAll(() => {
        userService = new UserService(); // Instantiate UserService
        mockAxios = new AxiosMockAdapter(axios);
    });
    afterEach(() => {
        // Reset the Axios mock after each test
        mockAxios.reset();
    });
    test('should return true if the user is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEmail = 'blacklisted@example.com';
        // Mock the API response to simulate a blacklisted user
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(200, { blacklisted: true, details: "User is blacklisted" });
        const result = yield userService.checkBlacklist(testEmail);
        expect(result).toBe(true);
    }));
    test('should return false if the user is not blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEmail = 'notblacklisted@example.com';
        // Mock the API response to simulate a user who is not blacklisted
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(200, { blacklisted: false });
        const result = yield userService.checkBlacklist(testEmail);
        expect(result).toBe(false);
    }));
    test('should throw an error if the API call fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEmail = 'errorcase@example.com';
        // Mock a failed API response
        mockAxios.onGet(process.env.KARMA_BLACKLIST_API_URL, { params: { identifier: testEmail } })
            .reply(500, { message: 'Internal Server Error' });
        yield expect(userService.checkBlacklist(testEmail)).rejects.toThrow('Failed to check blacklist status');
    }));
});
