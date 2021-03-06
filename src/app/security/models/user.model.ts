export class User {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: Authority[] = [] as Authority[];
    credentialsNonExpired: boolean;
    enabled: boolean;
    username: string;
    xsrftoken: string;

    static emptyUser(): User {
        let user = new User(); // NOSONAR not const
        user.username = 'No User';
        return user;
    }

    hasRole(roleName: string): boolean {
        if (roleName === undefined) {
            return false;
        }
        let roleToSearch: string = roleName.toUpperCase();
        if (!roleName.startsWith('ROLE_')) {
            roleToSearch = 'ROLE_' + roleToSearch;
        }
        return this.authorities.filter(value => value.authority === roleToSearch).length > 0;
    }
}

export class Authority {
    authority: string; // Role

    constructor(role: string) {
        this.authority = role;
    }
}
