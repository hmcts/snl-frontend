import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import * as rm from 'typed-rest-client/HttpClient';
import { CONFIG } from './../../url-config'
export class API {
    private static baseUrl = (process.env.TEST_URL !== undefined) ?
    'http://snl-api-aat.service.core-compute-aat.internal' : CONFIG.apiUrl;
    private static headers = { 'Authorization': '', 'Content-Type': 'application/json' }
    private static rest = new rm.HttpClient('e2e-tests', null, {headers: API.headers});

    static async createListingRequest(body: CreateListingRequestBody): Promise<number> {
        await API.login();
        const response = await this.rest.put(`${API.baseUrl}/hearing-part/create`, JSON.stringify(body), API.headers);
        await this.rest.post(`${API.baseUrl}/user-transaction/${body.userTransactionId}/commit`, JSON.stringify(body), API.headers);
        return response.message.statusCode;
    }

    private static async login() {
        const body = {
            username: Credentials.ValidOfficerUsername,
            password: Credentials.ValidOfficerPassword
        };
        const response = await API.rest.post(`${API.baseUrl}/security/signin`, JSON.stringify(body), API.headers)
        const responseBody = JSON.parse(await response.readBody());
        API.headers.Authorization = `${responseBody.tokenType} ${responseBody.accessToken}`;
    }
}
