"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinderError = exports.HTTPError = void 0;
class HTTPError extends Error {
    code;
    constructor(code, desc) {
        super(desc);
        this.code = code;
    }
}
exports.HTTPError = HTTPError;
class FinderError extends Error {
    constructor(code) {
        super(code);
    }
}
exports.FinderError = FinderError;
