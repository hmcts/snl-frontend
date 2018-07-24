// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

const isHeadlessModeEnabled = false;

const baseUrl = (process.env.TEST_URL || 'http://localhost:3451/').replace('https', 'http');

exports.config = {
    allScriptsTimeout: 111000,
    suites: {
      e2e: './**/*.e2e-spec.ts',
      smoke: '../smoke-test/*.smoke-spec.ts'
    },
    capabilities: {
        'browserName': 'chrome',
        'acceptInsecureCerts': true,
        chromeOptions: {
            args: isHeadlessModeEnabled ? ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'] : [],
            binary: puppeteer.executablePath(),
        }
    },
    directConnect: true,
    baseUrl: baseUrl,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 130000,
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