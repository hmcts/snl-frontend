import { fromResponse } from './status-config.model';
import { Status } from './status.model';

describe('StatusConfigModel', () => {
    this.statusConfigResponse = {
        status: 'Listed',
        canBeListed: false,
        canBeUnlisted: true
    };

    describe('fromResponse', () => {
        it('should parse status config from string', () => {
            let expectedStatusConfigEntry = {
                status: Status.Listed,
                canBeListed: false,
                canBeUnlisted: true
            };

            let statusConfigEntry = fromResponse(this.statusConfigResponse);

            expect(statusConfigEntry).toBeTruthy(expectedStatusConfigEntry);
        });
    });
});
