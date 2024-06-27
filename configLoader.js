// configLoader.js
const config = require('config');

class ConfigLoader {

    constructor() {

        const baseURL = process.env.SERVER_BASE_URL || config.get('FhirServer.BaseUrl') || 'https://cloud.alphora.com/sandbox/r4/cds/fhir';

        this.FhirServer = {
            BaseUrl: this.removeTrailingSlash(baseURL),
            CqlOperation: process.env.CQL_OPERATION || config.get('FhirServer.CqlOperation') || '$cql'
        };
        this.Tests = {
            ResultsPath: process.env.RESULTS_PATH || config.get('Tests.ResultsPath') || './results'
        };
        this.Debug = {
            QuickTest: process.env.QUICK_TEST || config.get('Debug.QuickTest') || true
        };
    }

    removeTrailingSlash(url) {
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    get apiUrl() {
        if (this.FhirServer.CqlOperation === '$cql') {
            return this.FhirServer.BaseUrl + '/$cql';
        }
        else {
            return this.FhirServer.BaseUrl + 'Library' + '/$evaluate';
        }
    }
}

module.exports = ConfigLoader;
