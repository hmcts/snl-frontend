import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { AssignHearingDialogComponent } from './assign-hearing-dialog.component';
import { HearingAssignmentNotesConfiguration } from '../../models/hearing-assignment-notes-configuration.model';
import SpyObj = jasmine.SpyObj;

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
    it('form group should be set properly', () => {
      component.ngOnInit();

      expect(component.startTime).toBeTruthy();
      expect(component.formGroup).toBeTruthy();
    })
  });

  describe('Init state', () => {
      it('form group should be set properly', () => {
          noteList.getModifiedNotes.and.returnValue([]);
          notesPreparerService.prepare.and.returnValue([]);
          notesPreparerService.removeEmptyNotes.and.returnValue([]);
          component.onListHearing();

          expect(spyDialogRef.close).toHaveBeenCalledWith({
              confirmed: true,
              startTime: this.startTime,
              notes: []
          });
      })
  });
});
