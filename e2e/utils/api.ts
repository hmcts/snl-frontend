import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import * as requestPromise from 'request-promise'
import * as URL from '../e2e-url.js'

const rp = (URL.proxy) ? requestPromise.defaults({proxy: URL.proxy, strictSSL: false}) : requestPromise;
const apiURL = (process.env.TEST_URL) ? 'https://snl-api-aat.service.core-compute-aat.internal' : URL.apiURL;

console.log('API URL: ' + apiURL)

export class API {
    private static baseUrl = apiURL;
    private static applicationJSONHeader = {'Content-Type': 'application/json'}
    private static headers = {'Authorization': '', ...API.applicationJSONHeader}

    static async createListingRequest(body: CreateListingRequestBody): Promise<number> {
        await API.login();
        const options = {
            method: 'PUT',
            uri: `${API.baseUrl}/hearing-part/create`,
            body: JSON.stringify(body),
            headers: API.headers,
            resolveWithFullResponse: true
        }
        const response = await rp(options)
        await API.commitUserTransaction(body)

        return response.statusCode;
    }

    static async createSession(body: SessionCreate) {
        await API.login();
        const options = {
            method: 'PUT',
            uri: `${API.baseUrl}/sessions`,
            body: JSON.stringify(body),
            headers: API.headers,
            resolveWithFullResponse: true
        }
        const response = await rp(options)
        await API.commitUserTransaction(body)

        return response.statusCode;
    }

    static async getProblems() {
        await API.login();
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/problems`,
            headers: API.headers,
            resolveWithFullResponse: true
        }
        const response = await rp(options)
        const responseBody = JSON.parse(response.body)
        return responseBody;
    }

    static async getHearingParts() {
        await API.login();
        const options = {
            method: 'GET',
            uri: `${API.baseUrl}/hearing-part`,
            headers: API.headers,
            resolveWithFullResponse: true
        }
        const response = await rp(options)
        const responseBody = JSON.parse(response.body)
        return responseBody;
    }

    private static async login() {
        if (API.headers.Authorization.length > 0) {
            return
        }

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

        const response = await rp(options)
        const responseBody = JSON.parse(response.body)
        API.headers.Authorization = `${responseBody.tokenType} ${responseBody.accessToken}`;
    }

    private static async commitUserTransaction(body: { userTransactionId: string }) {
        const commitUserTransactionOptions = {
            method: 'POST',
            uri: `${API.baseUrl}/user-transaction/${body.userTransactionId}/commit`,
            body: body,
            headers: {'Content-Type': 'application/json', 'Authorization': API.headers.Authorization},
            json: true // Automatically stringifies the body to JSON
        }
        await rp(commitUserTransactionOptions)
    }
}
