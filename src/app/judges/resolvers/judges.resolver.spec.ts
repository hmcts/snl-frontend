import { JudgesResolver } from './judges.resolver';

describe('JudgesResolver', () => {
    let nextMock;
    let stateMock;
    let serviceMock;

    beforeEach(() => {
        nextMock = jasmine.createSpy('next');
        stateMock = jasmine.createSpy('state');
        serviceMock = jasmine.createSpyObj('service', ['fetch', 'get']);
    });

    describe('Resolver', () => {
        it('calls proper super method', () => {
            this.resolver = new JudgesResolver(serviceMock);
            this.resolver.getOrFetchData = jasmine.createSpy('getOrFetchData', () => {});

            this.resolver.resolve(nextMock, stateMock);

            expect(this.resolver.getOrFetchData).toHaveBeenCalled();
        });
    })
});
