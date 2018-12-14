import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SecurityContext } from '../security/services/security-context.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error: any) {
        let router = this.injector.get(Router);
        console.log('handling error for URL: ' + router.url);

        error = this.handleRejection(error);

        if (this.handle401(error)
            || this.handleHttpErrorResponse(error)
            || this.handleClientError(error)) {
            return;
        }

        // in all other cases
        this.displayError(error);
    }

    handleRejection(error: any) {
        return error.rejection ? error.rejection : error;
    }

    handle401(error: any) {
        if (error && error.status === 401) {
            let router = this.injector.get(Router);
            let zone = this.injector.get(NgZone);
            let security = this.injector.get(SecurityContext);
            security.logout(() => {
                // do it only once if multiple parallel calls
                if (!router.url.startsWith('/auth/login')) {
                    console.log('Not authenticated, redirecting to login page.');
                    // running in the zone to trigger the change detection, otherwise the navigation does not work well
                    zone.run(() => router.navigate([ '/auth/login' ], { queryParams: { returnUrl: router.url } }));
                }
            });

            return true;
        }
    }

    handleHttpErrorResponse(error: any) {
        if (error instanceof HttpErrorResponse) {
            // Backend returns unsuccessful response codes such as 404, 500 etc.
            console.error('Backend returned status code: ', error.status);
            console.error('Response body:', error.message);

            this.displayError(error);
            return true;
        }
    }

    handleClientError(error: any) {
        console.error('An error occurred:', error.message);
        this.displayError(error);
        return true;
    }

    displayError(error: any) {
        // let router = this.injector.get(Router);
        // let zone = this.injector.get(NgZone);
        // let dialog = this.injector.get(MatDialog);
        // let location = this.injector.get(Location);
        // zone.run(() => {
        //     dialog.closeAll();
        //     location.replaceState('/');
        //     router.navigate(['/error'], { skipLocationChange: true })
        // });
        let errorBar = this.injector.get(MatSnackBar);
        errorBar.open('There was a problem with this action. Please refresh the page.');
    }
}
