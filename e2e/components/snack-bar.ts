import { element, by, promise } from '../../node_modules/protractor';

export class SnackBar {
    isNoteWithTextPresent(text: string): promise.Promise<boolean> {
        return element(by.cssContainingText('simple-snack-bar', text)).isPresent()
    }
}
