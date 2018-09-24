// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');
const configUtils = require('./e2e-config.js');
const config = configUtils.getConfig(configUtils.JENKINS_EXECUTOR, configUtils.PREVIEW_ENVIRONMENT);

console.log(config);
console.log('ASD');
console.log(JSON.stringify(process.env));

const isHeadlessModeEnabled = config.executorSettings.headlessMode;
const frontendURL = (process.env.TEST_URL || config.environment.frontendURL).replace('https', 'http');

console.log('Frontend URL: ' + frontendURL);

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,
    allScriptsTimeout: 111000,
    suites: {
      e2e: './**/*.e2e-spec.ts',
      smoke: '../smoke-test/*.smoke-spec.ts'
    },
    capabilities: {
        'browserName': 'chrome',
        'acceptInsecureCerts': true,
        loggingPrefs: {
            'driver': 'INFO',
            'browser': 'INFO'
        },
        chromeOptions: {
            args: isHeadlessModeEnabled ? ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'] : [],
            binary: puppeteer.executablePath(),
        },
        proxy: (!config.proxy.required) ? null : {
            proxyType: 'manual',
            httpProxy: config.proxy.url.replace('http://', '')
        }
    },
    directConnect: true,
    baseUrl: frontendURL,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 130000,
        print: function () {}
    },
    plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: './functional-output/e2e/',
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
    }
};