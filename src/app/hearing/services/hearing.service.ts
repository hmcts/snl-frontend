import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Hearing } from '../models/hearing';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { FilteredHearingViewmodel } from '../../hearing-part/models/filtered-hearing-viewmodel';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { SearchHearingRequest } from '../../hearing-part/models/search-hearing-request';
import { Page } from '../../problems/models/problem.model';

@Injectable()
export class HearingService {
    constructor(
        private readonly http: HttpClient,
        private readonly config: AppConfig,
        private readonly notesPopulatorService: NotesPopulatorService) {}

    getById(id: string): Observable<Hearing> {
        return this.http
            .get<Hearing>(`${this.config.getApiUrl()}/hearing/${id}/with-sessions`)
            .map(data => {
                this.notesPopulatorService.populateWithNotes(data);
                return data;
        });
    }

    getForAmendment(id: string): Observable<FilteredHearingViewmodel> {
        return this.http
          .get<FilteredHearingViewmodel>(`${this.config.getApiUrl()}/hearing/${id}/for-amendment`).pipe(map(
                (hearing: FilteredHearingViewmodel) => {
                    return this.mapHearingResponseToHearingVM(hearing);
                }
            ));
    }

    seearchFilteredHearingViewmodels(request: SearchHearingRequest): Observable<Page<FilteredHearingViewmodel>> {
        return this.http
            .post<Page<FilteredHearingViewmodel>>(`${this.config.getApiUrl()}/hearing`, request.searchCriteria, {
                params: new HttpParams({ fromObject: request.httpParams })
            }).pipe(map((hearingPage: Page<FilteredHearingViewmodel>) => {
                hearingPage.content = hearingPage.content.map(hearing => {
                    return this.mapHearingResponseToHearingVM(hearing);
                });
                return {...hearingPage, content: hearingPage.content}
            }))
    }

    private mapHearingResponseToHearingVM = (hearing: FilteredHearingViewmodel): FilteredHearingViewmodel => {
        hearing.scheduleStart = hearing.scheduleStart !== null ? moment(hearing.scheduleStart) : null;
        hearing.scheduleEnd = hearing.scheduleEnd !== null ? moment(hearing.scheduleEnd) : null;
        hearing.listingDate = moment(hearing.listingDate);
        hearing.duration = moment.duration(hearing.duration);
        return hearing;
    }

}
