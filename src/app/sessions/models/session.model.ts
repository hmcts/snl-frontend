export interface Session {
  id: string,
  start: Date;
  duration: number;
  room: string;
  person: string;
  caseType: string;
  hearingTypes: string[];
  jurisdiction: string;
}
