import * as HttpStatus from 'http-status-codes';

export const REFERENCE_DATA_ERROR = 'Could not load Reference data';

export const REFERENCE_DATA_DIALOGS = {
    [HttpStatus.INTERNAL_SERVER_ERROR]: REFERENCE_DATA_ERROR
}
