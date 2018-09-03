import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { CONFIG } from '../../url-config';
import * as rm from 'typed-rest-client/HttpClient';

export class API {
    private static headers = { 'Authorization': '', 'Content-Type': 'application/json' }
    private static rest = new rm.HttpClient('e2e-tests', null, {headers: API.headers});

    static async createListingRequest(body: CreateListingRequestBody): Promise<number> {
        await API.login();
        const response = await this.rest.put(`${CONFIG.apiUrl}/hearing-part/create`, JSON.stringify(body), API.headers);
        await this.rest.post(`${CONFIG.apiUrl}/user-transaction/${body.userTransactionId}/commit`, JSON.stringify(body), API.headers);
        return response.message.statusCode;
    }

    private static async login() {
        const body = {
            username: Credentials.ValidOfficerUsername,
            password: Credentials.ValidOfficerPassword
        };
        const response = await API.rest.post(`${CONFIG.apiUrl}/security/signin`, JSON.stringify(body), API.headers)
        const responseBody = JSON.parse(await response.readBody());
        API.headers.Authorization = `${responseBody.tokenType} ${responseBody.accessToken}`;
    }
}
