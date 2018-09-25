// Consts:
const LOCAL_EXECUTOR = 'local-executor';
const LOCAL_ENVIRONMENT = 'local-environment';
const JENKINS_EXECUTOR = 'jenkins-executor';
const PREVIEW_ENVIRONMENT = 'preview-environment';
const PROXY_URL = 'http://proxyout.reform.hmcts.net:8080';
const ENVIRONMENT_VARIABLE_TO_CHECK_IF_RAN_ON_JENKINS = "NODE_NAME";

let finalConfig = {};

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

    if ((executor === LOCAL_EXECUTOR) && (environment === PREVIEW_ENVIRONMENT)) {
        config.proxy = {
            required: true,
            url: PROXY_URL
        }
        config.environment = environments[PREVIEW_ENVIRONMENT];
    } else if ((executor === JENKINS_EXECUTOR)) {
        config.executorSettings = executorSettings[JENKINS_EXECUTOR];
        config.environment = environments[PREVIEW_ENVIRONMENT]
    }

    return config;
}

function getExecutor(processEnvVars) {
    let runningOnJenkins = processEnvVars[ENVIRONMENT_VARIABLE_TO_CHECK_IF_RAN_ON_JENKINS] !== undefined;
    console.log()
    return runningOnJenkins ? JENKINS_EXECUTOR : LOCAL_EXECUTOR;
}

function isExecutingOnJenkins(processEnvVars) {
    return getExecutor(processEnvVars) === JENKINS_EXECUTOR;
}

function setFinalConfig(config) {
    finalConfig = config;
}

function getFinalConfig() {
    return finalConfig;
}

module.exports = {
    getConfig: getConfig,
    getFinalConfig: getFinalConfig,
    setFinalConfig: setFinalConfig,
    getExecutor: getExecutor,
    isExecutingOnJenkins: isExecutingOnJenkins,
    LOCAL_EXECUTOR,
    LOCAL_ENVIRONMENT,
    JENKINS_EXECUTOR,
    PREVIEW_ENVIRONMENT
};

