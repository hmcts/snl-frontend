import { SessionViewModel } from '../../models/session.viewmodel';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import moment = require('moment');

export const getSessionResponse = {
  id: '2bfd6084-5240-4665-ae86-ba9d90e2215a',
  person: {
    id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
    personType: 'JUDGE',
    name: 'John Harris',
    username: null
  },
  start: '2018-06-14T09:12:40.003+02:00',
  duration: 'PT30M',
  caseType: 'SCLAIMS',
  room: { id: '30bcf571-45ca-4528-9d05-ce51b5e3fcde', name: 'Room A' }
};

export const normalizedGetSessionResponse = {
  entities: {
    persons: {
      'b5bc80ec-8306-4f0f-8c6e-af218bb116c2': {
        id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        personType: 'JUDGE',
        name: 'John Harris',
        username: null
      }
    },
    rooms: {
      '30bcf571-45ca-4528-9d05-ce51b5e3fcde': {
        id: '30bcf571-45ca-4528-9d05-ce51b5e3fcde',
        name: 'Room A'
      }
    },
    sessions: {
      '2bfd6084-5240-4665-ae86-ba9d90e2215a': {
        id: '2bfd6084-5240-4665-ae86-ba9d90e2215a',
        person: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        start: '2018-06-14T09:12:40.003+02:00',
        duration: 'PT30M',
        caseType: 'SCLAIMS',
        room: '30bcf571-45ca-4528-9d05-ce51b5e3fcde'
      }
    }
  },
  result: '2bfd6084-5240-4665-ae86-ba9d90e2215a'
};

export const getSessionsResponse = [
  {
    id: '2bfd6084-5240-4665-ae86-ba9d90e2215a',
    start: '2018-06-14T09:12:40.003+02:00',
    duration: 'PT30M',
    person: {
      id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
      personType: 'JUDGE',
      name: 'John Harris',
      username: null
    },
    room: { id: '30bcf571-45ca-4528-9d05-ce51b5e3fcde', name: 'Room A' },
    caseType: 'SCLAIMS'
  },
  {
    id: '1231244-5240-4665-ae86-baasdasd15a',
    start: '2018-06-16T09:12:40.003+02:00',
    duration: 'PT30M',
    person: {
      id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
      personType: 'JUDGE',
      name: 'John Harris',
      username: null
    },
    room: { id: '30bcf571-45ca-4528-9d05-ce51b5e3fcde', name: 'Room A' },
    caseType: 'SCLAIMS'
  }
];

export const normalizedGetSessionsResponse = {
  entities: {
    persons: {
      'b5bc80ec-8306-4f0f-8c6e-af218bb116c2': {
        id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        personType: 'JUDGE',
        name: 'John Harris',
        username: null
      }
    },
    rooms: {
      '30bcf571-45ca-4528-9d05-ce51b5e3fcde': {
        id: '30bcf571-45ca-4528-9d05-ce51b5e3fcde',
        name: 'Room A'
      }
    },
    sessions: {
      '2bfd6084-5240-4665-ae86-ba9d90e2215a': {
        id: '2bfd6084-5240-4665-ae86-ba9d90e2215a',
        start: '2018-06-14T09:12:40.003+02:00',
        duration: 'PT30M',
        person: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        room: '30bcf571-45ca-4528-9d05-ce51b5e3fcde',
        caseType: 'SCLAIMS'
      },
      '1231244-5240-4665-ae86-baasdasd15a': {
        id: '1231244-5240-4665-ae86-baasdasd15a',
        start: '2018-06-16T09:12:40.003+02:00',
        duration: 'PT30M',
        person: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        room: '30bcf571-45ca-4528-9d05-ce51b5e3fcde',
        caseType: 'SCLAIMS'
      }
    }
  },
  result: [
    '2bfd6084-5240-4665-ae86-ba9d90e2215a',
    '1231244-5240-4665-ae86-baasdasd15a'
  ]
};

export const getSessionsWithHearingsResponse = {
  sessions: [
    {
      id: 'a4a353d0-4bc1-4837-b49c-6e946ab96d6d',
      person: {
        id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        personType: 'JUDGE',
        name: 'John Harris',
        username: 'judge1'
      },
      start: '2018-06-15T11:00:57.353+02:00',
      duration: 'PT30M',
      caseType: 'SCLAIMS',
      room: { id: '3e699f29-6ea9-46bf-a338-00622fe0ae1b', name: 'Room B' }
    }
  ],
  hearingParts: [
    {
      id: '860f4aae-421c-4ca3-97b4-ddbbc0bf7ecb',
      caseNumber: '123',
      caseTitle: '123',
      caseType: 'SCLAIMS',
      hearingType: 'Preliminary Hearing',
      duration: 'PT10M',
      scheduleStart: null,
      scheduleEnd: null,
      start: null,
      createdAt: '2018-06-15T10:40:28.58+02:00',
      session: 'a4a353d0-4bc1-4837-b49c-6e946ab96d6d'
    }
  ]
};

export const normalizedGetSessionsWithHearings = {
  entities: {
    persons: {
      'b5bc80ec-8306-4f0f-8c6e-af218bb116c2': {
        id: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        personType: 'JUDGE',
        name: 'John Harris',
        username: 'judge1'
      }
    },
    rooms: {
      '3e699f29-6ea9-46bf-a338-00622fe0ae1b': {
        id: '3e699f29-6ea9-46bf-a338-00622fe0ae1b',
        name: 'Room B'
      }
    },
    sessions: {
      'a4a353d0-4bc1-4837-b49c-6e946ab96d6d': {
        id: 'a4a353d0-4bc1-4837-b49c-6e946ab96d6d',
        person: 'b5bc80ec-8306-4f0f-8c6e-af218bb116c2',
        start: '2018-06-15T11:00:57.353+02:00',
        duration: 'PT30M',
        caseType: 'SCLAIMS',
        room: '3e699f29-6ea9-46bf-a338-00622fe0ae1b'
      }
    },
    hearingParts: {
      '860f4aae-421c-4ca3-97b4-ddbbc0bf7ecb': {
        id: '860f4aae-421c-4ca3-97b4-ddbbc0bf7ecb',
        caseNumber: '123',
        caseTitle: '123',
        caseType: 'SCLAIMS',
        hearingType: 'Preliminary Hearing',
        duration: 'PT10M',
        scheduleStart: null,
        scheduleEnd: null,
        start: null,
        createdAt: '2018-06-15T10:40:28.58+02:00',
        session: 'a4a353d0-4bc1-4837-b49c-6e946ab96d6d'
      }
    },
    sessionsWithHearings: {
      undefined: {
        sessions: ['a4a353d0-4bc1-4837-b49c-6e946ab96d6d'],
        hearingParts: ['860f4aae-421c-4ca3-97b4-ddbbc0bf7ecb']
      }
    }
  },
  result: undefined
};
