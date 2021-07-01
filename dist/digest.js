"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchHashLocalStream = exports.getSearchHashLocal = exports.getSearchHash = void 0;
const tslib_1 = require("tslib");
const config_1 = require("./config");
const CODE = tslib_1.__importStar(require("./code"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const stream_1 = require("stream");
const token_1 = require("./token");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const util_1 = require("./util");
const err_1 = require("./err");
/**
 *
 * @param pic uri或文件的二进制数据
 * @returns
 */
async function getSearchHash(pic) {
    let searchType;
    if (pic instanceof Buffer) {
        if (pic.byteLength > config_1.ASCII2D_MAX_FILE_SIZE) {
            throw new err_1.FinderError(CODE.IMAGE_TOO_LARGE);
        }
        searchType = 'file';
    }
    else {
        if (pic instanceof stream_1.Readable) {
            searchType = 'file';
        }
        searchType = 'uri';
    }
    const token = await token_1.getAuthToken();
    const formData = new form_data_1.default();
    formData.append('authenticity_token', token);
    formData.append(searchType, pic);
    formData.append('utf8', '✓');
    const response = await node_fetch_1.default(util_1.concatUrl(config_1.ASCII2D_BASE_URL, `search/${searchType}`), {
        method: 'POST',
        body: formData,
        redirect: 'manual',
        headers: {
            'User-Agent': config_1.USER_AGENT,
            'Referer': 'https://ascii2d.net/'
        }
    });
    const url = response.headers.get('location');
    if (!url) {
        throw new err_1.FinderError(CODE.IMAGE_TOO_LARGE);
    }
    const searchHash = url.match(/\/([^/]+)$/)?.[1];
    if (!searchHash) {
        throw new err_1.FinderError(CODE.IMAGE_NOT_SUPPORT);
    }
    return searchHash;
}
exports.getSearchHash = getSearchHash;
async function getSearchHashLocal(buf) {
    const { createHash } = await Promise.resolve().then(() => tslib_1.__importStar(require('crypto')));
    const hash = createHash('md5');
    hash.update(buf);
    return hash.digest('hex');
}
exports.getSearchHashLocal = getSearchHashLocal;
async function getSearchHashLocalStream(stream) {
    return getSearchHashLocal(await util_1.readStream(stream));
}
exports.getSearchHashLocalStream = getSearchHashLocalStream;
