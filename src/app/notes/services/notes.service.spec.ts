import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesService } from './notes.service';
import { Note } from '../models/note.model';

const mockedAppConfig = { getNotesUrl: () => 'https://google.co.uk' };

let httpMock: HttpTestingController;
let notesService: NotesService;

let note = {
    id: '1',
    content: 'a',
    type: 't'
} as Note;

describe('NotesService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                NotesService,
                { provide: AppConfig, useValue: mockedAppConfig }
            ]
        });
        notesService = TestBed.get(NotesService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });

    describe('createManyNotes', () => {
        const expectedUrl = `${mockedAppConfig.getNotesUrl()}/notes`;

        it('should call proper url', () => {
            notesService.upsertMany([note]).subscribe(
                data => expect(data).toEqual([note])
            );
            httpMock.expectOne(expectedUrl).flush([note]);
        });
    });

    describe('get', () => {
        const expectedUrl = `${mockedAppConfig.getNotesUrl()}/notes`;

        it('should call proper url', () => {
            notesService.get().subscribe(
                data => expect(data).toEqual([note])
            );
            httpMock.expectOne(expectedUrl).flush([note]);
        });
    });

    describe('getByEntities', () => {
        const expectedUrl = `${mockedAppConfig.getNotesUrl()}/notes/entities`;

        it('should call proper url', () => {
            notesService.getByEntities(['id']).subscribe(
                data => expect(data[0].createdAt.isValid()).toBeTruthy()
            );
            httpMock.expectOne(expectedUrl).flush([{...note, createdAt: '2018-11-14T12:15:03.869+01:00'}]);
        });
    });
});
