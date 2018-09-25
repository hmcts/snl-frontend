import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import * as requestPromise from 'request-promise'
import * as configUtils from '../e2e-config.js'

const config = configUtils.getFinalConfig();

const rp = (config.proxy.url) ? requestPromise.defaults({ proxy: config.proxy.url, strictSSL: false}) : requestPromise;
const apiUrl = config.environment.apiURL;

export class API {
    private static baseUrl = apiUrl;
    private static applicationJSONHeader = {'Content-Type': 'application/json' }
    private static headers = { 'Authorization': '', ...API.applicationJSONHeader }

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

    private static async commitUserTransaction(body: {userTransactionId: string}) {
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
