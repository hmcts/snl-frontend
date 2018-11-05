import { StatusConfigService } from './status-config.service';
import { StatusConfigEntry } from './status-config.model';
import { Status } from './status.model';
import { Observable } from 'rxjs/Observable';

describe('StatusConfigService', () => {
    let httpMock;
    let configMock;
    let statusConfigResponse: StatusConfigEntry[];
    let statusConfigEntry: StatusConfigEntry;

    beforeAll(() => {
        statusConfigEntry = { status: Status.LISTED, canBeUnlisted: false, canBeListed: true };
        statusConfigResponse = [statusConfigEntry]
    });

    beforeEach(() => {
        httpMock = jasmine.createSpyObj('http', ['get']);
        configMock = jasmine.createSpyObj('config', ['getApiUrl']);
        this.service = new StatusConfigService(httpMock, configMock);
    })

    describe('When getting StatusConfig', () => {
        it('the default value should be set', () => {
            expect(this.service.getStatusConfig()).toEqual([]);
        });

        it('the http service is not called', () => {
            this.service.getStatusConfig();
            expect(httpMock.get).not.toHaveBeenCalled();
        });
    })

    describe('When fetching status configs', () => {
        it('the value for StatusConfig should be updated', () => {
            httpMock.get.and.returnValue(Observable.of(statusConfigResponse));

            this.service.fetchStatusConfig().subscribe();

            expect(this.service.getStatusConfig()).toEqual(statusConfigResponse);
        });
    });

    describe('When getting status configs', () => {
        beforeEach(() => {
            httpMock.get.and.returnValue(Observable.of(statusConfigResponse));
            this.service.fetchStatusConfig().subscribe();
        })

        it('for concrete key the value should be returned', () => {;
            expect(this.service.getStatusConfigEntry(Status.LISTED)).toEqual(statusConfigEntry);
        });

        it('for concrete key that does not exist the error is thrown', () => {;
            expect( () => { this.service.getStatusConfigEntry(Status.UNLISTED) }).toThrowError();
        });
    });
});
