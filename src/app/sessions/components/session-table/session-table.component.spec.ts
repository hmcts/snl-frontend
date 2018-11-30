import { SessionTableComponent } from './session-table.component';
import { DEFAULT_SESSION_FOR_LISTING_WITH_NOTES } from '../../models/session.viewmodel';

let component: SessionTableComponent;

fdescribe('SessionTableComponent', () => {
    beforeEach(() => {
        component = new SessionTableComponent();
    });

    describe('When setting sessions', () => {
        it('datasource is defined', () => {
            component.sessions = [];
            expect(component.dataSource).toBeDefined();
        });
    });

    describe('Go to first page', () => {
        it('calls paginator function', () => {
            component.paginator = {firstPage: jasmine.createSpy('firstPage')} as any;

            component.goToFirstPage();

            expect(component.paginator.firstPage).toHaveBeenCalled();
        });
    });

    describe('Toggle session', () => {
        it('when selected it adds new session to array if it does not exist', () => {
            component.sessions = [{...DEFAULT_SESSION_FOR_LISTING_WITH_NOTES, sessionId: 'id'}]
            component.toggleSession('id');
            expect(component.selectedSessions).toEqual([{...DEFAULT_SESSION_FOR_LISTING_WITH_NOTES, sessionId: 'id'}])
            expect(component.selectedSessionIds.isSelected('id')).toBeTruthy();
        });

        it('when unselected it removes session from array if session exists', () => {
            component.sessions = [{...DEFAULT_SESSION_FOR_LISTING_WITH_NOTES, sessionId: 'id'}]
            component.toggleSession('id');
            component.toggleSession('id');

            expect(component.selectedSessions).toEqual([]);
            expect(component.selectedSessionIds.isEmpty()).toBeTruthy();
        });
    });

    describe('Is checked', () => {
        it('When session is selected it returns strue', () => {
            component.sessions = [{...DEFAULT_SESSION_FOR_LISTING_WITH_NOTES, sessionId: 'id'}]
            component.toggleSession('id');

            expect(component.isChecked('id')).toBeTruthy();
        });
    });

    describe('Clear selection', () => {
        it('sessionIds and selectedSessions tables are cleared', () => {
            component.sessions = [{...DEFAULT_SESSION_FOR_LISTING_WITH_NOTES, sessionId: 'id'}]
            component.toggleSession('id');
            component.clearSelection();

            expect(component.selectedSessionIds.isEmpty()).toBeTruthy();
            expect(component.selectedSessions).toEqual([])
        });
    });
});
