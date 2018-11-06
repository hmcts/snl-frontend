import { StatusConfigService } from './status-config.service';
import { StatusConfigEntry, StatusConfigEntryResponse } from '../models/status-config.model';
import { Status } from '../models/status.model';
import { Observable } from 'rxjs/Observable';

describe('StatusConfigService', () => {
    let httpMock;
    let configMock;
    let statusConfigEntriesResponses: StatusConfigEntryResponse[];
    let statusConfigEntryResponse: StatusConfigEntryResponse;
    let statusConfigEntry: StatusConfigEntry;

    beforeAll(() => {
        statusConfigEntryResponse = { status: 'Listed', canBeUnlisted: false, canBeListed: true };
        statusConfigEntry = { status: Status.Listed, canBeUnlisted: false, canBeListed: true };
        statusConfigEntriesResponses = [statusConfigEntryResponse]
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
            httpMock.get.and.returnValue(Observable.of(statusConfigEntriesResponses));

            this.service.fetchStatusConfig().subscribe(data => {
                expect(data).toEqual([statusConfigEntry]);
            });

            expect(this.service.getStatusConfig()).toEqual([statusConfigEntry]);
        });
    });

    describe('When getting status configs', () => {
        beforeEach(() => {
            httpMock.get.and.returnValue(Observable.of(statusConfigEntriesResponses));
            this.service.fetchStatusConfig().subscribe();
        });

        it('for concrete key the value should be returned', () => {;
            expect(this.service.getStatusConfigEntry(Status.Listed)).toEqual(statusConfigEntry);
        });

        it('for concrete key that does not exist the error is thrown', () => {;
            expect( () => { this.service.getStatusConfigEntry(Status.Unlisted) }).toThrowError();
        });
    });
});
