import * as HttpStatus from 'http-status-codes';

export const HEARING_PART_ASSIGN_CONFLICT = 'The hearing part cannot be assigned because one of the engaged' +
    ' entities is already being modified by someone else. Please try again later';
export const HEARING_PART_ASSIGN_ERROR = 'Something went wrong';

export const HEARING_PART_DIALOGS = {
    [HttpStatus.CONFLICT]: HEARING_PART_ASSIGN_CONFLICT,
    [HttpStatus.INTERNAL_SERVER_ERROR]: HEARING_PART_ASSIGN_ERROR
}
