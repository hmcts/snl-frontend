import { Injectable } from '@angular/core';
// import { AppConfig } from '../../app.config';
// import { HttpClient } from '@angular/common/http';
import { Priority } from '../../hearing-part/models/priority-model';
import * as moment from 'moment';
import { Hearing } from '../models/listing';

@Injectable()
export class ListingService {
	constructor(
		// private readonly http: HttpClient, private readonly config: AppConfig
	) {
	}

	getById(id: string): Hearing {
		return {
			id: 'uuid-1',
			caseNumber: 'caseNumber',
			caseTitle: 'caseTitle',
			// todo add case type model
			caseType: 'type',
			// todo add hearing type model
			hearingType: 'type',
			// todo add duration model
			duration: 10,
			// todo use real date
			scheduleStart: moment(),
			// todo use real date
			scheduleEnd: moment(),
			priority: Priority.High,
			communicationFacilitator: 'Tłumacz needed',
			specialRequirements: 'special',
			facilityRequirements: 'facility',
			reservedToJudge: 'Sedzia Dredd',
			notes: [
				{
					content: 'tresc notki listingu',
					createdAt: moment(),
					modifiedBy: 'autor notki listingu'
				}
			],
			sessions: [
				{
					start: moment(),
					duration: 10,
					room: 'room name',
					judge: 'judge name',
					notes: [
						{
							content: 'tresc notki sesji',
							createdAt: moment(),
							modifiedBy: 'autor notki sesji'
						}
					]
				}
			]
		}
	}
}
