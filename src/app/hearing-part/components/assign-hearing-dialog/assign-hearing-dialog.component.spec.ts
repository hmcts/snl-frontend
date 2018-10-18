import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { AssignHearingDialogComponent } from './assign-hearing-dialog.component';
import { HearingAssignmentNotesConfiguration } from '../../models/hearing-assignment-notes-configuration.model';

describe('AssignHearingDialogComponent', () => {
  let component: AssignHearingDialogComponent;
  let notesConfiguration: HearingAssignmentNotesConfiguration;
  let notesPreparerService: NotesPreparerService;
  let selectedHearingId: string;
  let spyDialogRef: any;

  beforeEach(() => {
    spyDialogRef = jasmine.createSpyObj('dialogRef', ['close']);
    notesConfiguration = new HearingAssignmentNotesConfiguration();
    notesPreparerService = new NotesPreparerService();
    selectedHearingId = 'id';
    component = new AssignHearingDialogComponent(spyDialogRef, selectedHearingId, notesConfiguration, notesPreparerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When providing a list of notes', () => {
    it('which is empty only default notes are present', () => {
      component.onCancel();

      expect(spyDialogRef.close).toHaveBeenCalledWith({ confirmed: false })
    })
  })
});
