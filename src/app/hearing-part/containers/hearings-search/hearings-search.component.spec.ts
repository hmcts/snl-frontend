// // import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
// // import * as sessionReducers from '../../reducers';
// // import * as transactionsReducers from '../../../features/transactions/reducers';
// import { Judge } from '../../../judges/models/judge.model';
// import { Room } from '../../../rooms/models/room.model';
// import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
// import { Store, StoreModule } from '@ngrx/store';
// import { TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import * as fromHearingParts from '../../../hearing-part/reducers';
// import * as moment from 'moment';
// // import * as hearingPartActions from '../../../hearing-part/actions/hearing-part.action';
// // import * as roomActions from '../../../rooms/actions/room.action';
// // import * as judgeActions from '../../../judges/actions/judge.action';
// // import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
// import * as caseTypeReducers from '../../../core/reference/reducers/case-type.reducer';
// // import * as sessionTypeReducers from '../../../core/reference/reducers/session-type.reducer';
// import * as hearingTypeReducers from '../../../core/reference/reducers/hearing-type.reducer';
// import * as judgesReducers from '../../../judges/reducers';
// import * as notesReducers from '../../../notes/reducers';
// //
// // import * as sessionsActions from '../../actions/session.action';
// // import { SessionViewModel } from '../../models/session.viewmodel';
// // import { Session } from '../../models/session.model';
// // import { SessionFilters } from '../../models/session-filter.model';
// import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// // import * as notesActions from '../../../notes/actions/notes.action';
// import { Note } from '../../../notes/models/note.model';
// import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
// import { Priority } from '../../../hearing-part/models/priority-model';
// import { CaseType } from '../../../core/reference/models/case-type';
// import { HearingType } from '../../../core/reference/models/hearing-type';
// import { SessionType } from '../../../core/reference/models/session-type';
// import { HearingPartResponse } from '../../../hearing-part/models/hearing-part-response';
// import { HearingsSearchComponent } from './hearings-search.component';
// import { SessionsStatisticsService } from '../../../sessions/services/sessions-statistics-service';
// import { HearingsFilterService } from '../../services/hearings-filter-service';
// import { Session } from '../../../sessions/models/session.model';
// // import { SessionFilters } from '../../../sessions/models/session-filter.model';
// import { HearingsFilters } from '../../models/hearings-filter.model';
//
// let storeSpy: jasmine.Spy;
// let component: HearingsSearchComponent;
// let store: Store<fromHearingParts.State>;
// // let mockedFullSession: SessionViewModel[];
// const nowMoment = moment();
// const nowISOSting = nowMoment.toISOString();
// const roomId = 'some-room-id';
// const judgeId = 'some-judge-id';
// const stubCaseType = {code: 'some-case-type-code', description: 'some-case-type'} as CaseType;
// const stubCaseTypes = [stubCaseType];
// const stubSessionType = {code: 'some-session-type-code', description: 'some-session-type'} as SessionType;
// const stubSessionTypes = [stubSessionType];
// const stubHearingType = {code: 'some-hearing-type-code', description: 'some-hearing-type'} as HearingType;
// const stubHearingTypes = [stubHearingType];
// const durationStringFormat = 'PT30M';
// const sessionDuration = moment.duration(durationStringFormat).asMilliseconds();
// const overListedDuration = moment.duration('PT31M').asMilliseconds();
// const notListedDuration = moment.duration('PT0M').asMilliseconds();
// const customDuration = moment.duration('PT16M').asMilliseconds();
// const mockedRooms: Room[] = [{ id: roomId, name: 'some-room-name', roomTypeCode: 'code' }];
// const mockedJudges: Judge[] = [{ id: judgeId, name: 'some-judge-name' }];
// const mockedNotes: Note[] = [
//     {
//         id: 'note-id',
//         content: 'nice content',
//         type: 'Facility Requirements',
//         entityId: 'some-id',
//         entityType: 'ListingRequest',
//         createdAt: undefined,
//         modifiedBy: undefined
//     }];
//
// const mockedHearingPartResponse: HearingPartResponse = {
//   id: 'some-id',
//   sessionId: undefined,
//   caseNumber: 'abc123',
//   caseTitle: 'some-case-title',
//   caseTypeCode: stubCaseType.code,
//   hearingTypeCode: stubHearingType.code,
//   duration: durationStringFormat,
//   scheduleStart: nowISOSting,
//   scheduleEnd: nowISOSting,
//   version: 2,
//   priority: Priority.Low,
//   reservedJudgeId: judgeId,
//   communicationFacilitator: 'interpreter',
//   deleted: false
// }
//
// const mockedUnlistedHearingPartVM: HearingPartViewModel = {
//     id: 'some-id',
//     sessionId: undefined,
//     caseNumber: 'abc123',
//     caseTitle: 'some-case-title',
//     caseType: stubCaseType,
//     hearingType: stubHearingType,
//     duration: moment.duration(durationStringFormat),
//     scheduleStart: moment(nowISOSting),
//     scheduleEnd: moment(nowISOSting),
//     version: 2,
//     priority: Priority.Low,
//     reservedJudgeId: judgeId,
//     communicationFacilitator: 'interpreter',
//     notes: mockedNotes,
//     reservedJudge: mockedJudges[0]
// };
//
// // same as unlisted, but with session set to matching id in Session
// let mockedListedHearingPartVM: HearingPartViewModel = { ...mockedUnlistedHearingPartVM, sessionId: 'some-session-id' };
// let mockedListedHearingPart: HearingPartResponse = { ...mockedHearingPartResponse, sessionId: 'some-session-id' };
// const mockedListedHearingPartsVM: HearingPartViewModel[] = [mockedListedHearingPartVM];
// const mockedListedHearingPartResponses: HearingPartResponse[] = [mockedListedHearingPart];
//
// const mockedSessions: Session[] = [
//   {
//     id: 'some-session-id',
//     start: nowMoment,
//     duration: sessionDuration,
//     room: roomId,
//     person: judgeId,
//     sessionTypeCode: stubSessionType.code,
//     // hearingTypes: [stubHearingType.code],
//     jurisdiction: 'some jurisdiction',
//     version: 1
//   }
// ];
//
// describe('HearingsSearchComponent', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AngularMaterialModule,
//         FormsModule,
//         StoreModule.forRoot({}),
//         StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
//         // StoreModule.forFeature('sessions', sessionReducers.reducers),
//         StoreModule.forFeature('judges', judgesReducers.reducers),
//         StoreModule.forFeature('notes', notesReducers.reducers),
//         StoreModule.forFeature('caseTypes', caseTypeReducers.reducer),
//         // StoreModule.forFeature('sessionTypes', sessionTypeReducers.reducer),
//         StoreModule.forFeature('hearingTypes', hearingTypeReducers.reducer),
//         // StoreModule.forFeature('transactions', transactionsReducers.reducers),
//         BrowserAnimationsModule
//       ],
//       providers: [HearingsSearchComponent, SessionsStatisticsService, HearingPartModificationService, HearingsFilterService],
//       declarations: [TransactionDialogComponent]
//     });
//
//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [TransactionDialogComponent]
//       }
//     });
//
//     // mockedFullSession = [defaultFullMockedSession()];
//     component = TestBed.get(HearingsSearchComponent);
//     store = TestBed.get(Store);
//     storeSpy = spyOn(store, 'dispatch').and.callThrough();
//   });
//
//   // describe('constructor', () => {
//   //   it('should be defined', () => {
//   //     expect(component).toBeDefined();
//   //   });
//   //   it('should fetch hearingParts', () => {
//   //     store.dispatch(new referenceDataActions.GetAllCaseTypeComplete(stubCaseTypes));
//   //     store.dispatch(new referenceDataActions.GetAllHearingTypeComplete(stubHearingTypes));
//   //     store.dispatch(new hearingPartActions.SearchComplete([mockedHearingPartResponse]));
//   //     store.dispatch(new notesActions.UpsertMany(mockedNotes));
//   //     store.dispatch(new judgeActions.GetComplete(mockedJudges));
//   //
//   //     component.hearingParts$.subscribe(hearingParts => {
//   //       expect(hearingParts).toEqual([mockedUnlistedHearingPartVM]);
//   //     });
//   //   });
//   //   it('should fetch judges', () => {
//   //     store.dispatch(new judgeActions.GetComplete(mockedJudges));
//   //     component.judges$.subscribe(judges => {
//   //       expect(judges).toEqual(mockedJudges);
//   //     });
//   //   });
//   //   it('should fetch full sessions', () => {
//   //     store.dispatch(new referenceDataActions.GetAllCaseTypeComplete(stubCaseTypes));
//   //     store.dispatch(new referenceDataActions.GetAllHearingTypeComplete(stubHearingTypes));
//   //     store.dispatch(new referenceDataActions.GetAllSessionTypeComplete(stubSessionTypes));
//   //     store.dispatch(new notesActions.UpsertMany(mockedNotes));
//   //     store.dispatch(new hearingPartActions.SearchComplete(mockedListedHearingPartResponses));
//   //     store.dispatch(new roomActions.GetComplete(mockedRooms));
//   //     store.dispatch(new judgeActions.GetComplete(mockedJudges));
//   //     // store.dispatch(new sessionsActions.SearchComplete(mockedSessions));
//   //
//   //     // component.sessions$.subscribe(sessions => {
//   //     //   expect(sessions).toEqual(mockedFullSession);
//   //     // });
//   //   });
//   //   it('should set start and end date', () => {
//   //     expect(component.startDate).toBeDefined();
//   //     expect(component.endDate).toBeDefined();
//   //   });
//   // });
//   //
//   // describe('ngOnInit', () => {
//   //   beforeEach(() => {
//   //     component.ngOnInit();
//   //   });
//   //   // it('should dispatch [Session] SearchForDates action', () => {
//   //   //   const passedObj = storeSpy.calls.argsFor(0)[0];
//   //   //   expect(passedObj instanceof sessionsActions.SearchForDates).toBeTruthy();
//   //   // });
//   //   it('should dispatch [HearingParts] Search action', () => {
//   //     component.ngOnInit();
//   //     const passedObj = storeSpy.calls.argsFor(1)[0];
//   //     expect(passedObj instanceof hearingPartActions.Search).toBeTruthy();
//   //   });
//   //   it('should dispatch [RoomActions] Get action', () => {
//   //     component.ngOnInit();
//   //     const passedObj = storeSpy.calls.argsFor(2)[0];
//   //     expect(passedObj instanceof roomActions.Get).toBeTruthy();
//   //   });
//   //   it('should dispatch [JudgeActions] Get action', () => {
//   //     component.ngOnInit();
//   //     const passedObj = storeSpy.calls.argsFor(3)[0];
//   //     expect(passedObj instanceof judgeActions.Get).toBeTruthy();
//   //   });
//   // });
//   //
//   // describe('filterHearings', () => {
//   //   let hearingsFilter: HearingsFilters;
//   //   beforeEach(() => {
//   //     hearingsFilter = defaultHearingsFilter();
//   //   });
//   //   describe('when start dates are different', () => {
//   //     let startDayAsTomorrowFilters: SessionFilters;
//   //     beforeEach(() => {
//   //       startDayAsTomorrowFilters = defaultHearingsFilter();
//   //       startDayAsTomorrowFilters.startDate = moment().add(1, 'day');
//   //       component.filterHearings([], startDayAsTomorrowFilters);
//   //     });
//   //     it('should dispatch [Session] SearchForDates action', () => {
//   //       const action = storeSpy.calls.first().args[0];
//   //       expect(action instanceof sessionsActions.SearchForDates).toBeTruthy();
//   //     });
//   //     it('should set startDate equal to filters.startDate', () => {
//   //       expect(component.startDate).toBe(startDayAsTomorrowFilters.startDate);
//   //     });
//   //     it('should set endDate equal to filters.endDate', () => {
//   //       expect(component.endDate).toBe(startDayAsTomorrowFilters.endDate);
//   //     });
//   //   });
//   //   it('should filter sessions by existing judge ids', () => {
//   //     hearingsFilter.judges = [judgeId];
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by not existing judge ids', () => {
//   //     hearingsFilter.judges = ['not-existing-id'];
//   //     computeAndVerifyFilteredSessionToBeEmptyArray(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by existing room ids', () => {
//   //     hearingsFilter.rooms = [roomId];
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by not existing room ids', () => {
//   //     hearingsFilter.rooms = ['not-existing-id'];
//   //     computeAndVerifyFilteredSessionToBeEmptyArray(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by existing session types', () => {
//   //     hearingsFilter.sessionTypes = [stubSessionType.code];
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by not existing session types', () => {
//   //     hearingsFilter.sessionTypes = ['not-existing-id'];
//   //     computeAndVerifyFilteredSessionToBeEmptyArray(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by utilization', () => {
//   //     hearingsFilter.utilization.fullyListed.active = true;
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by part listed utilization', () => {
//   //     hearingsFilter.utilization.partListed.active = true;
//   //     mockedFullSession[0].hearingParts[0].duration = moment.duration(
//   //       customDuration
//   //     );
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by over listed utilization', () => {
//   //     hearingsFilter.utilization.overListed.active = true;
//   //     mockedFullSession[0].hearingParts[0].duration = moment.duration(
//   //       overListedDuration
//   //     );
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by unlisted utilization', () => {
//   //     hearingsFilter.utilization.unlisted.active = true;
//   //     mockedFullSession[0].hearingParts[0].duration = moment.duration(
//   //       notListedDuration
//   //     );
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   //   it('should filter sessions by custom utilization', () => {
//   //     hearingsFilter.utilization.custom = {
//   //       active: true,
//   //       from: 45,
//   //       to: 55
//   //     };
//   //     mockedFullSession[0].hearingParts[0].duration = moment.duration(
//   //       customDuration
//   //     );
//   //     computeAndVerifyFilteredSession(component, hearingsFilter);
//   //   });
//   // });
// });
//
// // Helpers
// //
// // function computeAndVerifyFilteredSession(
// //   sessionSearchComponent: HearingsSearchComponent,
// //   sessionFilter: SessionFilters
// // ): void {
// //   const expectedFilteredSessions = sessionSearchComponent.filterHearings(
// //     mockedFullSession,
// //     sessionFilter
// //   );
// //   expect(mockedFullSession).toEqual(expectedFilteredSessions);
// // }
// //
// // function computeAndVerifyFilteredSessionToBeEmptyArray(
// //   sessionSearchComponent: HearingsSearchComponent,
// //   sessionFilter: SessionFilters
// // ): void {
// //   const filteredSessions = sessionSearchComponent.filterHearings(
// //     mockedFullSession,
// //     sessionFilter
// //   );
// //   expect(filteredSessions).toEqual([]);
// // }
//
// // function defaultFullMockedSession(): SessionViewModel {
// //   return {
// //     id: 'some-session-id',
// //     start: nowMoment,
// //     duration: sessionDuration,
// //     room: mockedRooms[0],
// //     person: mockedJudges[0],
// //     sessionType: stubSessionType,
// //     hearingParts: mockedListedHearingPartsVM,
// //     jurisdiction: 'some jurisdiction',
// //     version: 1,
// //     allocated: moment.duration('PT30M'),
// //     utilization: 100,
// //     available: moment.duration('PT0M'),
// //     notes: []
// //   };
// // }
//
// function defaultHearingsFilter(): HearingsFilters {
//   return {
//     caseTypes: [],
//     hearingTypes: [],
//     judges: [],
//     startDate: moment(),
//     endDate: moment().add(2, 'day'),
//     utilization: {
//       unlisted: {
//         active: false,
//         from: 0,
//         to: 0
//       },
//       partListed: {
//         active: false,
//         from: 1,
//         to: 99
//       },
//       fullyListed: {
//         active: false,
//         from: 100,
//         to: 100
//       },
//       overListed: {
//         active: false,
//         from: 101,
//         to: Infinity
//       },
//       custom: {
//         active: false,
//         from: 0,
//         to: 0
//       }
//     }
//   };
// }
