export declare class HTTPError extends Error {
    code: number;
    constructor(code: number, desc: string);
}
export declare class FinderError extends Error {
    constructor(code: number);
}
