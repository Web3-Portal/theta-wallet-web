const BASE_URL = "http://aa01e64343b8911e9a1e80a36cb5f0f9-1355901417.us-east-2.elb.amazonaws.com";//https://api-wallet.thetatoken.org";
const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

//
//Helpers
//

export function isResponseSuccessful(response){
    let { status } = response;

    return (status === 200 || status === 201 || status === 202 || status === 204);
}

function objectToQueryString(object) {
    if(!object){
        return "";
    }

    let queryString = Object.keys(object).map(function(key) {
        let val = object[key];
        if(val){
            return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
        }
    }).join('&');

    if(queryString.length > 0){
        return "?" + queryString;
    }
    else{
        return "";
    }
}

//
//Builders
//

function buildHeaders(additionalHeaders) {
    //TODO inject auth headers here...
    return Object.assign(DEFAULT_HEADERS, additionalHeaders);
}

function buildURL(path, queryParams) {
    let url = null;

    if(path.startsWith("http://") || path.startsWith("https://")){
        url = path + objectToQueryString(queryParams);
    }
    else{
        url = BASE_URL + path + objectToQueryString(queryParams);
    }

    return url;
}

function sendRequest(path, method, additionalHeaders, queryParams, body) {
    let url = buildURL(path, queryParams);
    let headers = buildHeaders(additionalHeaders);

    let opts = {
        method: method,
        headers: headers,
    };

    if (body) {
        opts['body'] = JSON.stringify(body);
    }

    return fetch(url, opts);
}


//
//Convenience requests
//

function GET(path, headers, queryParams) {
    return sendRequest(path, "GET", headers, queryParams);
}

function PUT(path, headers, queryParams, body) {
    return sendRequest(path, "PUT", headers, queryParams, body);
}

function POST(path, headers, queryParams, body) {
    return sendRequest(path, "POST", headers, queryParams, body);
}

function DELETE(path, headers, queryParams, body) {
    return sendRequest(path, "DELETE", headers, queryParams, body);
}

export default class Api {

    //
    //Wallet
    //

    static fetchWallet(address, queryParams) {
        let path = `/wallet/${ address }`;
        return GET(path, null, queryParams);
    }

    //
    //Transactions
    //

    static createTransaction(body, queryParams) {
        let path = `/tx`;
        return POST(path, null, queryParams, body);
    }

    static fetchTransaction(transactionID, queryParams) {
        let path = `/tx/${ transactionID }`;
        return GET(path, null, queryParams);
    }

    static fetchTransactions(address, queryParams) {
        let path = `/tx/${ address }/list`;
        return GET(path, null, queryParams);
    }

    //
    //Sequence
    //

    static fetchSequence(address, queryParams) {
        let path = `/sequence/${ address }`;
        return GET(path, null, queryParams);
    }

    //
    //Stakes
    //

    static fetchStakes(address, queryParams) {
        let path = `/stake/${ address }/list`;
        return GET(path, null, queryParams);
    }

    //
    //Smart Contract
    //

    static callSmartContract(body, queryParams) {
        //let path = `/smart-contract/call`;

        //FIXME: this is only for testing...once the backend is deployed, we can call the API as normal...but the privatenet does not have
        let path = "http://aa01e64343b8911e9a1e80a36cb5f0f9-1355901417.us-east-2.elb.amazonaws.com/smart-contract/call";
        path = "/smart-contract/call";

        return POST(path, null, queryParams, body);
    }

    static executeSmartContract(body, queryParams) {
        let path = "http://aa01e64343b8911e9a1e80a36cb5f0f9-1355901417.us-east-2.elb.amazonaws.com/tx";
        path = "/tx";

        return POST(path, null, queryParams, body);
    }
}

