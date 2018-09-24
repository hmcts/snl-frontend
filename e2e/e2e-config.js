// Consts:
const LOCAL_EXECUTOR = 'local-executor';
const LOCAL_ENVIRONMENT = 'local-environment';
const JENKINS_EXECUTOR = 'jenkins-executor';
const PREVIEW_ENVIRONMENT = 'preview-environment';
const PROXY_URL = 'http://proxyout.reform.hmcts.net:8080';

// Input Parameters:
let EXECUTOR = LOCAL_EXECUTOR;
let ENVIRONMENT = PREVIEW_ENVIRONMENT;

// Configs:
const executorSettings = {
    [LOCAL_EXECUTOR]: {
        headlessMode: false
    },
    [JENKINS_EXECUTOR]: {
        headlessMode: true,
    }
};

const environments = {
    [PREVIEW_ENVIRONMENT]: {
        frontendURL: "http://snl-frontend-aat.service.core-compute-aat.internal",
        apiURL: "http://snl-api-aat.service.core-compute-aat.internal"
    },
    [LOCAL_ENVIRONMENT]: {
        frontendURL: "http://localhost:3451/",
        apiURL: "http://localhost:8090"
    }
};

const defaultConfig = {
    executorSettings: executorSettings[LOCAL_EXECUTOR],
    environment: environments[LOCAL_ENVIRONMENT],
    proxy: {
        required: false,
        url: undefined
    }
};

function getConfig(executor, environment) {
    let config = defaultConfig;

    if((executor === LOCAL_EXECUTOR) && (environment === PREVIEW_ENVIRONMENT)) {
        config.proxy = {
            required: true,
            url: PROXY_URL
        }
    } else if ((executor === JENKINS_EXECUTOR)) {
        config.executorSettings = executorSettings[JENKINS_EXECUTOR];
        config.environment = environments[PREVIEW_ENVIRONMENT]
    }

    return config;
}

module.exports = {
    getConfig: getConfig,
    LOCAL_EXECUTOR,
    LOCAL_ENVIRONMENT,
    JENKINS_EXECUTOR,
    PREVIEW_ENVIRONMENT
};

