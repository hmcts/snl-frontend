import { browser, by, ElementFinder } from 'protractor';

export class Paginator {
  constructor(private parentElement: ElementFinder) {}

  async nextPageClick() {
    const nextPage = await this.parentElement.element(by.css('.mat-paginator-navigation-next'));
    await nextPage.click();
    await browser.waitForAngular();
  }

  async hasNextPage(): Promise<boolean> {
    const nextPage = await this.parentElement.element(by.css('.mat-paginator-navigation-next'));
    return await nextPage.isEnabled();
  }
}
