import { Note } from './note.model';
import { getNoteViewModel } from './note.viewmodel';

let note = {
    id: '1',
    content: 'a',
    type: 't',
    parentId: 'p',
    entity: 'e'
} as Note;

describe('When converting note to noteviewmodel', () => {
    it('the \'modified\' flag should be set by default to \'false\'', () => {
        expect(getNoteViewModel(note).modified).toEqual(false)
    });
});
