import { element, by, ExpectedConditions, browser } from '../../node_modules/protractor';
import { Wait } from '../enums/wait';

export class SnackBar {
    async isNoteWithTextPresent(text: string): Promise<boolean> {
        const snackBar = element(by.cssContainingText('simple-snack-bar', text))
        await browser.wait(ExpectedConditions.visibilityOf(snackBar), Wait.normal, `Snack bar with text: ${text} haven't appear`);

        return snackBar.isPresent()
    }
}
