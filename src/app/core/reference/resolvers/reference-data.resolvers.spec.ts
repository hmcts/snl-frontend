import { CaseTypesResolver } from './case-types.resolver';
import { StatusConfigResolver } from './status-config.resolver';
import { HearingTypesResolver } from './hearing-types.resolver';

describe('ReferenceDataResolvers', () => {
    let nextMock;
    let stateMock;
    let serviceMock;

    beforeEach(() => {
        nextMock = jasmine.createSpy('next');
        stateMock = jasmine.createSpy('state');
        serviceMock = jasmine.createSpyObj('service', ['fetchCaseTypes', 'getCaseTypes']);
    });

    describe('CaseTypesResolver', () => {
        it('calls proper super method', () => {
            this.resolver = new CaseTypesResolver(serviceMock);
            this.resolver.getOrFetchData = jasmine.createSpy('getOrFetchData', () => {});

            this.resolver.resolve(nextMock, stateMock);

            expect(this.resolver.getOrFetchData).toHaveBeenCalled();
        });
    })

    describe('HearingTypesResolver', () => {
        it('calls proper super method', () => {
            this.resolver = new HearingTypesResolver(serviceMock);
            this.resolver.getOrFetchData = jasmine.createSpy('getOrFetchData', () => {});

            this.resolver.resolve(nextMock, stateMock);

            expect(this.resolver.getOrFetchData).toHaveBeenCalled();
        });
    })

    describe('StatusConfigResolver', () => {
        it('calls proper super method', () => {
            this.resolver = new StatusConfigResolver(serviceMock);
            this.resolver.getOrFetchData = jasmine.createSpy('getOrFetchData', () => {});

            this.resolver.resolve(nextMock, stateMock);

            expect(this.resolver.getOrFetchData).toHaveBeenCalled();
        });
    })
});
