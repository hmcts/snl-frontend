// import { TestBed } from '@angular/core/testing';
// import { provideMockActions } from '@ngrx/effects/testing';
// import { ReplaySubject } from 'rxjs/ReplaySubject';
// import { hot, cold } from 'jasmine-marbles';
// import { Observable } from 'rxjs';
//
// import { NotesEffects } from './notes.effects';
// import * as NoteActions from '../actions/notes.action';
//
// describe('Notes Effects', () => {
//     let effects: NotesEffects;
//     let actions: Observable<any>;
//
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 // any modules needed
//             ],
//             providers: [
//                 NotesEffects,
//                 provideMockActions(() => actions),
//                 // other providers
//             ],
//         });
//
//         effects = TestBed.get(NotesEffects);
//     });
//
//     it('should work', () => {
//         const action = new NoteActions.Get();
//
//         // Refer to 'Writing Marble Tests' for details on '--a-' syntax
//         actions = hot('--a-', { a: action });
//         const expected = cold('--b', { b: completion });
//
//         expect(effects.get$).toBeObservable(expected);
//     });
//
//     it('should work also', () => {
//         actions = new ReplaySubject(1);
//
//         actions.next(SomeAction);
//
//         effects.someSource$.subscribe(result => {
//             expect(result).toEqual(AnotherAction);
//         });
//     });
// });
