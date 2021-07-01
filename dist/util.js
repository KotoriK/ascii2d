"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpError = exports.readStream = exports.concatUrl = void 0;
const err_1 = require("./err");
const concatUrl = (...urls) => urls.map(url => {
    const _url = url.startsWith('/') ? url.substr(1) : url;
    return _url.endsWith('/') ? _url.substr(0, _url.length - 1) : _url;
}).join('/');
exports.concatUrl = concatUrl;
function readStream(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        });
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}
exports.readStream = readStream;
function httpError(resp) {
    return new err_1.HTTPError(resp.status, resp.statusText);
}
exports.httpError = httpError;
