"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByUrl = exports.searchByBuffer = exports.searchByHash = exports.MODULE_NAME = void 0;
const tslib_1 = require("tslib");
exports.MODULE_NAME = 'ascii2d';
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const config_1 = require("./config");
const digest_1 = require("./digest");
const util_1 = require("./util");
function parseResult(body, returnAll) {
    const $ = cheerio_1.default.load(body);
    const itemBoxes = $('.item-box').slice(1, typeof returnAll == 'number' ? returnAll : undefined);
    const result = [];
    for (const _itemBox of itemBoxes.toArray()) {
        const itemBox = $(_itemBox);
        const infoBox = itemBox.find('.info-box');
        const detailBox = infoBox.find('.detail-box');
        const info = infoBox.text();
        const [_, size, type, file_size] = info.match(/(\d+x\d+) (\S+) (\S+)/);
        const children = itemBox.children();
        if (children.length > 0) {
            const anchors = detailBox.find('a');
            const title = $(anchors[0]);
            const author = $(anchors[1]);
            result.push({
                title: title.text(),
                author: author.text(),
                artwork_url: title.attr('href'),
                author_url: author.attr('href'),
                from: detailBox.find('small').text().trim(),
                size,
                type,
                file_size
            });
        }
    }
    return result;
}
/**
 *
 * @param hash image hash
 * @param searchMode 'color' or 'bovw'
 * @param returnAll numbers of results you want, or pass not-numeric value(except those equal to false) to return all of them
 * @returns
 */
async function searchByHash(hash, searchMode = "color", returnAll = 5) {
    const url = util_1.concatUrl(config_1.ASCII2D_BASE_URL, 'search', searchMode, hash);
    const resp = await node_fetch_1.default(url, {
        headers: {
            'User-Agent': config_1.USER_AGENT,
        }
    });
    if (resp.ok) {
        return {
            url,
            results: parseResult(await resp.text(), returnAll),
            searchMode,
        };
    }
    else {
        throw util_1.httpError(resp);
    }
}
exports.searchByHash = searchByHash;
/**
 *
 * @param pic buffer of the picture
 * @param searchMode
 * @param digestLocally digest by ASCII2D API or digest locally
 * @param returnAll 解析前几个结果，为true时解析全部结果
 * @returns
 */
async function searchByBuffer(pic, searchMode = "color", digestLocally, returnAll = 5) {
    const hash = await (digestLocally ? digest_1.getSearchHashLocal(pic) : digest_1.getSearchHash(pic));
    return searchByHash(hash, searchMode, returnAll);
}
exports.searchByBuffer = searchByBuffer;
async function searchByUrl(url, searchMode = "color", digestLocally, returnAll = 5) {
    if (digestLocally) {
        const resp = await node_fetch_1.default(url, {
            headers: {
                'User-Agent': config_1.USER_AGENT,
            }
        });
        if (resp.ok) {
            const pic = await resp.buffer();
            return searchByHash(await digest_1.getSearchHashLocal(pic), searchMode, returnAll);
        }
        else {
            throw util_1.httpError(resp);
        }
    }
    else {
        const hash = await digest_1.getSearchHash(url);
        return searchByHash(hash, searchMode, returnAll);
    }
}
exports.searchByUrl = searchByUrl;
