export const AuthorizationHeaderName = 'Authorization';

export class AccessToken {
    accessToken: string | String = '';
    tokenType: string | String = '';

    constructor(accessToken: string, tokenType: string) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    public getAsHeader() {
        return  { headerName: AuthorizationHeaderName, headerToken: `${this.tokenType} ${this.accessToken}` };
    }
}
