var attEnv = {
    proxy: 'http://proxyout.reform.hmcts.net:8080',
    frontendURL: "https://snl-frontend-aat.service.core-compute-aat.internal",
    apiURL: "https://snl-api-aat.service.core-compute-aat.internal"
};

var prEnv = {
    proxy: 'http://proxyout.reform.hmcts.net:8080',
    frontendURL: "https://pr-174-snl-frontend-preview.service.core-compute-preview.internal",
    apiURL: "https://pr-82-snl-api-preview.service.core-compute-preview.internal"
};

var localEnv = {
    frontendURL: "http://localhost:3451/",
    apiURL: "http://localhost:8090"
};

//module.exports = attEnv;
//module.exports = prEnv;
module.exports = localEnv;