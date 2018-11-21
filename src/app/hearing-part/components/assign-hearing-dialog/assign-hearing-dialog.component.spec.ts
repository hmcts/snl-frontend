import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { AssignHearingDialogComponent } from './assign-hearing-dialog.component';
import { HearingAssignmentNotesConfiguration } from '../../models/hearing-assignment-notes-configuration.model';
import SpyObj = jasmine.SpyObj;
import * as moment from 'moment';

describe('AssignHearingDialogComponent', () => {
  let component: AssignHearingDialogComponent;
  let notesConfiguration: HearingAssignmentNotesConfiguration;
  let notesPreparerService: SpyObj<NotesPreparerService>;
  let selectedHearingId: string;
  let spyDialogRef: any;
  const noteList = jasmine.createSpyObj('noteList', ['getModifiedNotes']);

  beforeEach(() => {
    spyDialogRef = jasmine.createSpyObj('dialogRef', ['close']);
    notesConfiguration = new HearingAssignmentNotesConfiguration();
    notesPreparerService = jasmine.createSpyObj('notesPreparerService', ['removeEmptyNotes', 'prepare']);
    selectedHearingId = 'id';
    component = new AssignHearingDialogComponent(spyDialogRef, selectedHearingId, notesConfiguration, notesPreparerService);
    component.noteList = noteList;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When providing a list of notes', () => {
    it('which is empty only default notes are present', () => {
      component.onCancel();

      expect(spyDialogRef.close).toHaveBeenCalledWith({ confirmed: false })
    })
  });

  describe('Init state', () => {
    it(', without startTimeDisplayed, formGroup should be set and startTime be undefined', () => {
      component.ngOnInit();

      expect(component.startTime).toBeUndefined();
      expect(component.formGroup).toBeTruthy();
      expect(component.formGroup.get('startTime').validator).toBeNull();
    });

    it(', with startTimeDisplayed false, formGroup should be set and startTime should be undefined', () => {
      const dialogData = {
          hearingId: 'id',
          startTimeDisplayed: false
      };
      component = new AssignHearingDialogComponent(spyDialogRef, dialogData, notesConfiguration, notesPreparerService);
      component.ngOnInit();

      expect(component.startTime).toBeUndefined();
      expect(component.formGroup).toBeTruthy();
      expect(component.formGroup.get('startTime').validator).toBeNull();
    });

    it(', with startTimeDisplayed true, formGroup and startTime should be set properly', () => {
      const givenStartTime = moment();
      const dialogData = {
          hearingId: 'id',
          startTimeDisplayed: true,
          startTime: givenStartTime
      };
      component = new AssignHearingDialogComponent(spyDialogRef, dialogData, notesConfiguration, notesPreparerService);
      component.ngOnInit();

      expect(component.startTime).toBe(givenStartTime.format('HH:mm'));
      expect(component.formGroup).toBeTruthy();
      expect(component.formGroup.get('startTime').validator).toBeDefined()
    })
  });

  describe('onListHearing', () => {
      it(', should return properly set values', () => {
          noteList.getModifiedNotes.and.returnValue([]);
          notesPreparerService.prepare.and.returnValue([]);
          notesPreparerService.removeEmptyNotes.and.returnValue([]);
          component.onListHearing();

          expect(spyDialogRef.close).toHaveBeenCalledWith({
              confirmed: true,
              startTime: component.startTime,
              notes: []
          });
      })
  });
});
