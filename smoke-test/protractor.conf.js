// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

const isHeadlessModeEnabled = true;

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './test/*'
  ],
  capabilities: {
    'browserName': 'chrome',
    'acceptInsecureCerts': true,
    chromeOptions: {
      args: isHeadlessModeEnabled ? ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] : [],
      binary: puppeteer.executablePath(),
    }
  },
  directConnect: true,
  baseUrl: process.env.TEST_URL || 'http://localhost:3451/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
    browser.manage().timeouts().implicitlyWait(5000);
    return browser.get('/');
  }
};