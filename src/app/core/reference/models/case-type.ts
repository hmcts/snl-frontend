import { SimpleReferenceType } from './simple-reference-type';
import { HearingType } from './hearing-type';

export interface CaseType extends SimpleReferenceType {
    hearingTypes: HearingType[];
}
