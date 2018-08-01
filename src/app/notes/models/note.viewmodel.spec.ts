import { getNoteFromViewModel } from './note.model';
import { NoteViewmodel } from './note.viewmodel';

let note = {
    id: '1',
    content: 'a',
    type: 't',
    parentId: 'p',
    modified: true,
} as NoteViewmodel;

describe('When converting NoteViewmodel to note', () => {
    it('the \'modified\' flag should not exist', () => {
        expect(Object.keys(getNoteFromViewModel(note))).not.toContain('modified')
    });
});
