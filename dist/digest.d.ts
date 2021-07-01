/// <reference types="node" />
import { Readable } from 'stream';
/**
 *
 * @param pic uri或文件的二进制数据
 * @returns
 */
export declare function getSearchHash(pic: Buffer | Readable | string): Promise<string>;
export declare function getSearchHashLocal(buf: Buffer): Promise<string>;
export declare function getSearchHashLocalStream(stream: Readable): Promise<string>;
