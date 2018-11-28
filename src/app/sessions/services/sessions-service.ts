import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchCriteria } from './../../hearing-part/models/search-criteria';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { SessionCreate } from '../models/session-create.model';
import { session, sessions, sessionsWithHearings } from '../../core/schemas/data.schema';
import { normalize } from 'normalizr';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { getHttpFriendly } from '../../utils/date-utils';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SearchHearingRequest } from '../../hearing-part/models/search-hearing-request';
import {
    mapResponseToSessionForListing,
    SessionForListing,
    SessionForListingResponse,
    SessionForListingWithNotes
} from '../models/session.viewmodel';
import { Note } from '../../notes/models/note.model';
import { NotesService } from '../../notes/services/notes.service';
import { SessionSearchResponse } from '../models/session-search-response.model';
import { Page } from '../../problems/models/problem.model';
import { PaginatedRequestOption } from '../models/paginated-request-option';
import { SessionAmendResponse } from '../models/session-amend.response';

@Injectable()
export class SessionsService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig, private readonly notesService: NotesService) {
    }

    getSessionsForListing(request: SearchHearingRequest): Observable<Page<SessionForListingWithNotes>> {
        let params = {
            page: request.httpParams.page,
            size: request.httpParams.size,
            sort: request.httpParams.sortByProperty + ':' + request.httpParams.sortDirection
        };
        return this.http
            .post<Page<SessionForListingResponse>>(`${this.config.getApiUrl()}/sessions/search`, request.searchCriteria, {
                params: new HttpParams({fromObject: params})
            }).pipe(map<Page<SessionForListingResponse>, Page<SessionForListing>>((sessionPage: Page<SessionForListingResponse>) => {
                let content = sessionPage.content.map(sessionForListingResponse => {
                    return mapResponseToSessionForListing(sessionForListingResponse);
                });
                return {...sessionPage, content: content}
            }), mergeMap<Page<SessionForListing>, Page<SessionForListingWithNotes>>((sessionForListingPage: Page<SessionForListing>) => {
                let sessionIds = sessionForListingPage.content.map(s => s.sessionId);
                return this.notesService.getByEntitiesAsDictionary(sessionIds).pipe(mergeMap((notes: Note[]) => {
                    const sessionsPage: Page<SessionForListingWithNotes> = {...sessionForListingPage, content: []};
                    sessionForListingPage.content.forEach(s => {
                        let sessionWithNotes: SessionForListingWithNotes = {...s, notes: notes[s.sessionId] || []};
                        sessionsPage.content.push(sessionWithNotes)
                    });
                    return Observable.of(sessionsPage);
                }))
            }))
    }

    getSession(sessionId: string): Observable<any> {
        return this.http
            .get<Session>(`${this.config.getApiUrl()}/sessions/${sessionId}`)
            .pipe(map(data => {
                return normalize(data, session)
            }));
    }

    searchSessions(query: SessionQuery): Observable<any> {
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`)
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    paginatedSearchSessions(searchCriterions: SearchCriteria[], requestOptions: PaginatedRequestOption)
        : Observable<Page<SessionSearchResponse>> {
        let url = `${this.config.getApiUrl()}/sessions/search`
        let httpParams: any = { }

        if (requestOptions.pageSize !== undefined && requestOptions.pageIndex !== undefined) {
            httpParams.size = requestOptions.pageSize;
            httpParams.page = requestOptions.pageIndex;
        }

        if (requestOptions.sortByProperty !== undefined && requestOptions.sortDirection.length > 1) {
            httpParams.sort = requestOptions.sortByProperty + ':' + requestOptions.sortDirection
        }

        return this.http.post<Page<SessionSearchResponse>>(url, searchCriterions, {
            params: new HttpParams({ fromObject: httpParams })
        })
    }

    searchSessionsForDates(query: SessionQueryForDates): Observable<any> {
        const fromDate = getHttpFriendly(query.startDate);
        const toDate = getHttpFriendly(query.endDate);

        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?startDate=${fromDate}&endDate=${toDate}`)
            .pipe(map(data => { let normalized = normalize(data, sessionsWithHearings); return normalized }));
    }

    searchSessionsForJudge(parameters: DiaryLoadParameters): Observable<any> {
        return this.http
            .get<Session[]>(this.createJudgeDiaryUrl(parameters))
            .pipe(map(data => {
                return normalize(data, sessions)
            }));
    }

    searchSessionsForJudgeWithHearings(parameters: DiaryLoadParameters): Observable<any> {
        return this.http
            .get<Session[]>(this.createJudgeDiaryUrl(parameters))
            .pipe(map(data => {
                return normalize(data, sessionsWithHearings)
            }));
    }

    createSession(sessionCreate: SessionCreate): Observable<any> {
        return this.http
            .put<string>(`${this.config.getApiUrl()}/sessions`, sessionCreate)
    }

    amendSession(sessionAmend: SessionAmmend): Observable<any> {
        return this.http
            .post<string>(`${this.config.getApiUrl()}/sessions/amend`, sessionAmend)
    }

    /**
     * @param update - should contain {version: number} and other elements
     * @returns {Observable<any>}
     */
    updateSession(update: any, version: number): Observable<any> {
        update.version = version;
        return this.http
            .put<string>(`${this.config.getApiUrl()}/sessions/update`, update);
    }

    private createJudgeDiaryUrl(parameters: DiaryLoadParameters) {
        return `${this.config.getApiUrl()}` +
            `/sessions/judge-diary` +
            `?judge=${parameters.judgeUsername}` +
            `&startDate=${getHttpFriendly(parameters.startDate)}` +
            `&endDate=${getHttpFriendly(parameters.endDate)}`;
    }

    getSessionAmendById(sessionId: string): Observable<SessionAmendResponse> {
        return this.http.get<SessionAmendResponse>(`${this.config.getApiUrl()}/sessions/amend/${sessionId}`);
    }
}
