export interface Session {
  id: number,
  start: Date;
  duration: number;
  room: string;
  person: string;
  caseType: string;
  hearingTypes: string[];
  jurisdiction: string;
}
