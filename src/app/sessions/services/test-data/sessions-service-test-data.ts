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

export const paginatedSessionSearchResponse = {
  content: [
    {
      sessionId: 'f080f856-e4dd-4fdc-8f0e-090d47e096b7',
      personId: '1143b1ea-1813-4acc-8b08-f37d1db59492',
      personName: 'Judge Linda',
      roomId: null,
      roomName: null,
      sessionTypeCode: 'small-claims',
      sessionTypeDescription: 'Small Claims',
      startTime: '2018-11-26T10:00:00+01:00',
      startDate: '2018-11-26T10:00:00+01:00',
      duration: 'PT2H',
      noOfHearingPartsAssignedToSession: 1,
      allocatedDuration: 'PT2H',
      utilisation: 100,
      available: 'PT0S'
    },
    {
      sessionId: 'be460d12-1a2b-4dbf-8b8e-a6fa95db55a9',
      personId: '1143b1ea-1813-4acc-8b08-f37d1db59492',
      personName: 'Judge Linda',
      roomId: null,
      roomName: null,
      sessionTypeCode: 'fast-track',
      sessionTypeDescription: 'Fast Track',
      startTime: '2018-11-27T10:00:00+01:00',
      startDate: '2018-11-27T10:00:00+01:00',
      duration: 'PT2H',
      noOfHearingPartsAssignedToSession: 2,
      allocatedDuration: 'PT3H',
      utilisation: 150,
      available: 'PT0S'
    },
    {
      sessionId: '48876471-3468-45c7-8899-bd9d28cdd775',
      personId: '1143b1ea-1813-4acc-8b08-f37d1db59492',
      personName: 'Judge Linda',
      roomId: null,
      roomName: null,
      sessionTypeCode: 'multi-track',
      sessionTypeDescription: 'Multi Track',
      startTime: '2018-11-28T10:00:00+01:00',
      startDate: '2018-11-28T10:00:00+01:00',
      duration: 'PT3H',
      noOfHearingPartsAssignedToSession: 1,
      allocatedDuration: 'PT3H',
      utilisation: 100,
      available: 'PT0S'
    }
  ],
  last: true,
  totalPages: 1,
  totalElements: 3,
  size: 20,
  number: 0,
  first: true,
  sort: null,
  numberOfElements: 3
};
