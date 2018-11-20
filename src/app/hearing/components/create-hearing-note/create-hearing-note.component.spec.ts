import { CreateHearingNoteComponent } from './create-hearing-note.component';

const component = new CreateHearingNoteComponent();

const mockedNoteComponent = jasmine.createSpyObj('NoteComponent', ['note']);

describe('CreateHearingNoteComponent', () => {

    it('when note has some content button is enabled', () => {
        const note = {
            content: 'some content'
        };

        mockedNoteComponent.note = note;
        component.noteComponent = mockedNoteComponent;

        expect(component.isButtonDisabled()).toBeFalsy();
    });

    it('when note has empty content button should be disabled', () => {
        const note = {
            content: ''
        };
        mockedNoteComponent.note = note;
        component.noteComponent = mockedNoteComponent;

        expect(component.isButtonDisabled()).toBeTruthy();
    });

    it('calling submit should emit onSubmit event', () => {
        const note = {
            content: 'some content'
        };

        spyOn(component.onSubmit, 'emit');
        component.submit(note as any);

        expect(component.onSubmit.emit).toHaveBeenCalled();
    });
});
