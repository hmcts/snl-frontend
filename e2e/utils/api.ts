import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import * as requestPromise from 'request-promise'
import * as URL from '../e2e-url.js'
import { DeleteListingRequestBody } from '../models/delete-listing-request-body';
import { v4 as uuid } from 'uuid';

const rp = (URL.proxy) ? requestPromise.defaults({proxy: URL.proxy, strictSSL: false}) : requestPromise;
const apiURL = (process.env.API_URL || URL.apiURL).replace('https', 'http');

console.log('API URL: ' + apiURL);

export class API {
    private static baseUrl = apiURL;
    private static applicationJSONHeader = {'Content-Type': 'application/json'};
    private static headers = {'Authorization': '', ...API.applicationJSONHeader};

    static async createListingRequest(body: CreateListingRequestBody): Promise<number> {
        await API.login();
        const options = {
            method: 'PUT',
            uri: `${API.baseUrl}/hearing-part/create`,
            body: JSON.stringify(body),
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        await API.commitUserTransaction(body);

        return response.statusCode;
    }

    private static async getListingRequestById(id: string) {
        await API.login();
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/hearing-part/${id}`,
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        const responseBody = JSON.parse(response.body);
        return responseBody;
    }

    private static async deleteListingRequestWithBody(body: DeleteListingRequestBody) {
        await API.login();
        const options = {
            method: 'POST',
            uri: `${API.baseUrl}/hearing-part/delete`,
            body: JSON.stringify(body),
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);

        return response.statusCode;
    }

    static async deleteListingRequest(id: string) {
        await API.login();
        const versionId = 1; // should get version id from below
        await API.getListingRequestById(id);
        const transactionId = uuid().toString();

        await API.deleteListingRequestWithBody({
            hearingId: id, hearingVersion: versionId, userTransactionId: transactionId
        })
    }

    static async createSession(body: SessionCreate) {
        await API.login();
        const options = {
            method: 'PUT',
            uri: `${API.baseUrl}/sessions`,
            body: JSON.stringify(body),
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        await API.commitUserTransaction(body);

        return response.statusCode;
    }

    static async getProblems() {
        await API.login();
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/problems`,
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        const responseBody = JSON.parse(response.body);
        return responseBody;
    }

    static async getHearingParts() {
        await API.login();
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/hearing-part`,
            headers: API.headers,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        const responseBody = JSON.parse(response.body);
        return responseBody;
    }

    static async healthCheck() {
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/health`,
            resolveWithFullResponse: true
        };
        const response = await rp(options);
        return response.body;
    }

    private static async login() {
        const options = {
            method: 'POST',
            uri: `${API.baseUrl}/security/signin`,
            body: JSON.stringify({
                username: Credentials.ValidOfficerUsername,
                password: Credentials.ValidOfficerPassword
            }),
            headers: API.applicationJSONHeader,
            resolveWithFullResponse: true,
        };

        const response = await rp(options);
        const responseBody = JSON.parse(response.body);
        API.headers.Authorization = `${responseBody.tokenType} ${responseBody.accessToken}`;
    }

    private static async commitUserTransaction(body: { userTransactionId: string }) {
        const commitUserTransactionOptions = {
            method: 'POST',
            uri: `${API.baseUrl}/user-transaction/${body.userTransactionId}/commit`,
            body: body,
            headers: {'Content-Type': 'application/json', 'Authorization': API.headers.Authorization},
            json: true // Automatically stringifies the body to JSON
        };
        await rp(commitUserTransactionOptions)
    }
}
