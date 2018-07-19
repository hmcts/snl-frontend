import { browser } from 'protractor';

describe('SNL frontend smoke tests', () => {
    describe('health check', () => {
        it('should get page', () => {
            browser.get('/');

            expect(browser.getTitle()).toEqual('Scheduling and Listing');
        });
    });
});
