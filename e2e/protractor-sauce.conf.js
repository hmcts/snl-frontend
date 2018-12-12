// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');
const URL = require('./e2e-url.js');
const timeout = 10 * 60 * 1000;

const frontendURL = (process.env.TEST_URL || URL.frontendURL).replace('https', 'http');
const isDemo = frontendURL.includes('demo');
const isAat = frontendURL.includes('aat');
const apiDbHost = (process.env.API_DB_HOST || 'localhost');
const apiDbPort = (process.env.API_DB_PORT || 5434);
const apiDbName = (process.env.API_DB_NAME || 'snl');
const apiDbUser = (process.env.API_DB_USER || 'snluser');
const apiDbPassword = (process.env.API_DB_PASSWORD || 'snlpass');

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    sauceSeleniumAddress: 'ondemand.saucelabs.com:443/wd/hub',
    allScriptsTimeout: timeout,
    suites: {
        e2e: './**/*.e2e-spec.ts'
    },
    multiCapabilities: [{
        'browserName': 'internet explorer',
        'platform': 'Windows 10',
        'version': '11.103',
        'name': 'snl-IE-tests',
        'tunnel-identifier': 'reformtunnel',
        'screenResolution': '1280x1024',
        'timeZone': 'London', //need to check if jenkins has London's timezone
        'extendedDebugging': true,
        'maxDuration': 5400,
        'idleTimeout': 300
    }],
    baseUrl: frontendURL,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: timeout,
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
        // If aat or demo env, make sure we have test user data
        if(isAat || isDemo) {
            const insertUsers = require('./insert-users.js');
            insertUsers.insertUserData(apiDbHost, apiDbPort, apiDbName, apiDbUser, apiDbPassword).catch(err => {
                console.error("ERROR:", err.message() || err);
                // TODO: is it possible to fail all tests early from here?
            });
        };

        // SauceLabs is slow and needs a bigger timeout
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;

        // returning the promise makes protractor wait for the reporter config before executing tests
        global.browser.getProcessedConfig().then(function (config) {
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
        const printSessionId = function (jobName) {
            browser.getSession().then(function (session) {
                console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
            });
        };
        printSessionId("snl-frontend");
    }
};