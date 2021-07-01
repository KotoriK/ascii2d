/// <reference types="node" />
import { Response } from "node-fetch";
import { Readable } from "stream";
import { HTTPError } from "./err";
export declare const concatUrl: (...urls: string[]) => string;
export declare function readStream(stream: Readable): Promise<Buffer>;
export declare function httpError(resp: Response): HTTPError;
