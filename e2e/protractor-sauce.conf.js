// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

const isHeadlessModeEnabled = true;

const baseUrl = (process.env.TEST_URL || 'http://localhost:3451/');

exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    sauceSeleniumAddress: 'ondemand.saucelabs.com:443/wd/hub',
    allScriptsTimeout: 111000,
    suites: {
      e2e: './**/*.e2e-spec.ts',
      smoke: '../smoke-test/*.smoke-spec.ts'
    },
    multiCapabilities: [{
           'browserName': 'internet explorer',
           'platform': 'Windows 10',
           'version': '11.103',
           'name': 'snl-IE-tests',
           'tunnel-identifier': 'reformtunnel',
           'extendedDebugging': true,
           'shardTestFiles': true,
           'maxInstances': 2
        }],
    baseUrl: baseUrl,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 130000,
        isVerbose: true,
        includeStackTrace: true,
        print: function () {}
    },
    plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: './functional-output/crossbrowser/reports',
        screenshotOnExpect: 'failure+success',
        screenshotOnSpec: 'none',
        withLogs: true,
        writeReportFreq: 'asap',
        verbose: 'info',
        imageToAscii: 'none',
        clearFoldersBeforeTest: true
      }],
    onPrepare() {
        // Uncomment below line while debugging
        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60 * 1000;

        // returning the promise makes protractor wait for the reporter config before executing tests
        global.browser.getProcessedConfig().then(function(config) {
            //it is ok to be empty
        });
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true
            }
        }));
        return browser.get('/');
    },
    onComplete: function () {
            var printSessionId = function (jobName) {
                browser.getSession().then(function (session) {
                    console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
                });
            }
        printSessionId("snl-frontend");
        }
};