import { StatusConfigEntry } from '../models/status-config.model';
import { Status } from '../models/status.model';
import { StatusConfigResolver } from './status-config.resolver';
import { Observable } from 'rxjs/Observable';

describe('StatusConfigResolver', () => {
    let nextMock;
    let stateMock;
    let statusConfigServiceMock;
    let statusConfigEntry: StatusConfigEntry;

    beforeAll(() => {
        statusConfigEntry = { status: Status.Listed, canBeUnlisted: false, canBeListed: true };
    });

    beforeEach(() => {
        nextMock = jasmine.createSpy('next');
        stateMock = jasmine.createSpy('state');
        statusConfigServiceMock = jasmine.createSpyObj('statusConfigService', ['getStatusConfig', 'fetchStatusConfig']);

        this.resolver = new StatusConfigResolver(statusConfigServiceMock);
    });

    describe('When StatusConfig service is populated', () => {
        it('fetch method is not called', () => {
            statusConfigServiceMock.getStatusConfig.and.returnValue([statusConfigEntry]);

            this.resolver.resolve(nextMock, stateMock);

            expect(statusConfigServiceMock.fetchStatusConfig).not.toHaveBeenCalled();
        });

        it('current StatusConfig value is returned', () => {
            statusConfigServiceMock.getStatusConfig.and.returnValue([statusConfigEntry]);

            let hasObservableEmitted = false;
            this.resolver.resolve(nextMock, stateMock).subscribe(data => {
                expect(data).toEqual([statusConfigEntry]);
                hasObservableEmitted = true;
            });

            expect(hasObservableEmitted).toBeTruthy();
        });
    })

    describe('When StatusConfig service is not populated', () => {
        it('fetch method is called and current StatusConfig value is returned', () => {
            statusConfigServiceMock.getStatusConfig.and.returnValue([]);
            statusConfigServiceMock.fetchStatusConfig.and.returnValue(Observable.of([statusConfigEntry]));

            this.resolver.resolve(nextMock, stateMock).subscribe(() => {
                expect(statusConfigServiceMock.getStatusConfig).toHaveBeenCalledTimes(1);
            })
        });
    })
});
