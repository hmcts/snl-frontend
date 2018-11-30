import { Hearing } from './../models/hearing';
import { PossibleHearingActionsService } from './possible-hearing-actions.service';
import { MatDialog } from '@angular/material';
import { HearingActions } from '../models/hearing-actions';
import { Observable } from 'rxjs';
import { HearingService } from './hearing.service';

const hearingWithAllPossibleActions = {
    possibleActions: {
        Adjourn: true,
        Unlist: true,
        Withdraw: true
    }
} as Hearing

const dialogMock: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open'])
const hearingServiceMock: jasmine.SpyObj<HearingService> = jasmine.createSpyObj('HearingService', ['getById', 'unlist'])

describe('PossibleHearingActionsService', () => {
    describe('mapToHearingPossibleActions', () => {
        it('should set enabled possible actions', () => {
            const possibleActionService = new PossibleHearingActionsService({} as any, {} as any);
            const hearing = {
                possibleActions: {
                    Adjourn: true,
                    Unlist: false,
                    Withdraw: true
                }
            } as Hearing

            const mappedPossibleActions = possibleActionService.mapToHearingPossibleActions(hearing)
            expect(mappedPossibleActions['Unlist'].enabled).toBeFalsy()
            expect(mappedPossibleActions['Adjourn'].enabled).toBeTruthy()
            expect(mappedPossibleActions['Withdraw'].enabled).toBeTruthy()
        })
    });

    describe('handleAction', () => {
        describe('when action is disabled', () => {
            it('should not open dialog', () => {
                const possibleActionService = new PossibleHearingActionsService(dialogMock, {} as any)
                possibleActionService.handleAction(HearingActions.Adjourn, {} as Hearing)
                expect(dialogMock.open).not.toHaveBeenCalled()
            })
        });

        describe('when action is enabled', () => {
            it('should open dialog', () => {
                dialogMock.open.and.returnValue({afterClosed: () => Observable.of(false)} )
                const possibleActionService = new PossibleHearingActionsService(dialogMock, {} as any)
                possibleActionService.mapToHearingPossibleActions(hearingWithAllPossibleActions)

                possibleActionService.handleAction(HearingActions.Adjourn, {} as Hearing)

                expect(dialogMock.open).toHaveBeenCalled()
            })

            describe('when dialog return confirmed as true', () => {
                it('should call service, open summary dialog and fetch heairng by id ', () => {
                    dialogMock.open.and.returnValue({afterClosed: () => Observable.of(true)} )
                    const possibleActionService = new PossibleHearingActionsService(dialogMock, hearingServiceMock)
                    possibleActionService.mapToHearingPossibleActions(hearingWithAllPossibleActions)
                    const expectedId = 'someid'
                    possibleActionService.handleAction(HearingActions.Unlist, {id: expectedId} as Hearing)

                    expect(hearingServiceMock.unlist).toHaveBeenCalled()
                    expect(hearingServiceMock.getById).toHaveBeenCalledWith(expectedId)
                })
            });
        });
    });
});
