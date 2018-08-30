import { element, by, promise, ExpectedConditions, browser } from '../../node_modules/protractor';
import { Wait } from '../enums/wait';

export class SnackBar {
    isNoteWithTextPresent(text: string): promise.Promise<boolean> {
        const snackBar = element(by.cssContainingText('simple-snack-bar', text))
        browser.wait(ExpectedConditions.visibilityOf(snackBar), Wait.normal);

        return snackBar.isPresent()
    }
}
