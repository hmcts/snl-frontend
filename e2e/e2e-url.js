var attEnv = {
    proxy: 'http://proxyout.reform.hmcts.net:8080',
    frontendURL: "http://snl-frontend-aat.service.core-compute-aat.internal",
    apiURL: "http://snl-api-aat.service.core-compute-aat.internal"
};

var prEnv = {
    proxy: 'http://proxyout.reform.hmcts.net:8080',
    frontendURL: "http://pr-174-snl-frontend-preview.service.core-compute-preview.internal",
    apiURL: "http://pr-82-snl-api-preview.service.core-compute-preview.internal"
};

var localEnv = {
    frontendURL: "http://localhost:3451/",
    apiURL: "http://localhost:8090"
};

//module.exports = attEnv;
//module.exports = prEnv;
module.exports = attEnv;