import { browser, protractor } from 'protractor';

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function() {
  const args = arguments;

  // queue 100ms wait
  origFn.call(browser.driver.controlFlow(), function() {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};