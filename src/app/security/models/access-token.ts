export const AuthorizationHeaderName = 'Authorization';

export class AccessToken {
    accessToken = '';
    tokenType = '';

    constructor(accessToken: string, tokenType: string) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    public getAsHeader() {
        return  { headerName: AuthorizationHeaderName, headerToken: `${this.tokenType} ${this.accessToken}` };
    }
}
