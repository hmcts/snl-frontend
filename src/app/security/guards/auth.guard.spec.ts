import { AuthGuard } from './auth.guard';

let authGuard: AuthGuard;
let securityServiceSpy, routerSpy, next, state;

describe('AuthGuard', () => {
    beforeEach(() => {

        securityServiceSpy = jasmine.createSpyObj('SecuritySevice', ['isAuthenticated']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        next = jasmine.createSpy('next');
        state = jasmine.createSpy('state');

        authGuard = new AuthGuard(securityServiceSpy, routerSpy);
    });

    describe('canActivate', () => {
        it('should return true if authenticated', () => {
            securityServiceSpy.isAuthenticated.and.returnValue(true);

            expect(authGuard.canActivate(next, state)).toBeTruthy();
        });

        it('should return false if not authenticated', () => {
            securityServiceSpy.isAuthenticated.and.returnValue(false);

            expect(authGuard.canActivate(next, state)).toBeFalsy();
        });

    });
});
