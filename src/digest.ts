import {ASCII2D_BASE_URL, ASCII2D_MAX_FILE_SIZE, USER_AGENT} from './config'
import * as CODE from './code'
import FormData from 'form-data'
import { Readable } from 'stream'
import { getAuthToken } from './token'
import fetch from 'node-fetch'
import { concatUrl, readStream } from './util'
import { FinderError } from './err'
/**
 * 
 * @param pic uri或文件的二进制数据
 * @returns
 */
 export async function getSearchHash(pic: Buffer|Readable|string) {
    let searchType: 'file' | 'uri'
    if (pic instanceof Buffer) {
        if (pic.byteLength > ASCII2D_MAX_FILE_SIZE) {
            throw new FinderError(CODE.IMAGE_TOO_LARGE);
        }
        searchType = 'file'
    } else {
        if (pic instanceof Readable) {
            searchType = 'file'

        } 
            searchType = 'uri'
    }
    const token = await getAuthToken();
    const formData = new FormData()
    formData.append('authenticity_token', token)
    formData.append(searchType, pic)
    formData.append('utf8', '✓')
    const response = await fetch(concatUrl(ASCII2D_BASE_URL, `search/${searchType}`), {
        method: 'POST',
        body: formData,
        redirect: 'manual',
        headers:{
            'User-Agent':USER_AGENT,
            'Referer':'https://ascii2d.net/'
        }
    });

    const url = response.headers.get('location');
    if (!url) {
        throw new FinderError(CODE.IMAGE_TOO_LARGE);
    }
    const searchHash = url.match(/\/([^/]+)$/)?.[1];
    if (!searchHash) {
        throw new FinderError(CODE.IMAGE_NOT_SUPPORT);
    }
    return searchHash;
}

export async function getSearchHashLocal(buf:Buffer){
    const { createHash } = await import('crypto')
    const hash = createHash('md5')
    hash.update(buf)
    return hash.digest('hex')
}