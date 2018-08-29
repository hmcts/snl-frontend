import { HttpClient } from 'protractor-http-client'
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { promise } from 'protractor';
import { Credentials } from '../enums/credentials';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { CONFIG } from '../../url-config';

export class API {
    private static http = new HttpClient(CONFIG.apiUrl);
    private static headers = { 'Authorization': '' }

    static async createListingRequest(body: CreateListingRequestBody): Promise<ResponsePromise> {
        await API.login();
        const response = await this.http.put('/hearing-part/create', body, API.headers);
        this.http.post(`/user-transaction/${body.userTransactionId}/commit`, body, API.headers);

        return response;
    }

    private static login(): promise.Promise<any> {
        const body = {
            username: Credentials.ValidOfficerUsername,
            password: Credentials.ValidOfficerPassword
        };

        return this.http.post('/security/signin', body, API.headers).then((response: ResponsePromise|any) => {
            API.headers.Authorization = `${response.body.tokenType} ${response.body.accessToken}`;
            return response
        });
    }
}
