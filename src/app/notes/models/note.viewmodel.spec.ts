import { getNoteFromViewModel } from './note.model';
import { enableDisplayCreationDetails, NoteViewmodel } from './note.viewmodel';

let note = {
    id: '1',
    content: 'a',
    type: 't',
    entityId: 'p',
    modified: true,
} as NoteViewmodel;

describe('When converting NoteViewmodel to note', () => {
    it('the \'modified\' flag should not exist', () => {
        expect(Object.keys(getNoteFromViewModel(note))).not.toContain('modified')
    });
});

describe('When enabling display creation details', () => {
    it('display property should be true', () => {
        enableDisplayCreationDetails(note);
        expect(note.displayCreationDetails).toBeTruthy()
    })
})
