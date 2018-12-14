export class User {
    private static _emptyUser: User;

    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: Authority[] = [] as Authority[];
    credentialsNonExpired: boolean;
    enabled: boolean;
    username: string;
    xsrftoken: string;

    static emptyUser(): User {
        if (User._emptyUser) {
            return User._emptyUser;
        }
        User._emptyUser = new User(); // NOSONAR not const
        User._emptyUser.username = 'No User';
        return User._emptyUser;
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
