export const MODULE_NAME = 'ascii2d'

import Cheerio from 'cheerio'
import fetch from 'node-fetch'

export type ASCII2DSearchMode = 'color' | 'bovw';
export type ASCII2DSourceType =
    | 'pixiv'
    | 'twitter'
    | 'amazon'
    | 'dlsite'
    | 'tinami'
    | 'ニコニコ静画';
import { ASCII2D_BASE_URL, USER_AGENT, } from './config'
import { getSearchHash, getSearchHashLocal } from './digest';
import { concatUrl, httpError } from './util';
function parseResult(body: string, returnAll: true | number) {
    const $ = Cheerio.load(body)
    const itemBoxes = $('.item-box').slice(1, typeof returnAll == 'number' ? returnAll : undefined)
    const result = []
    for (const _itemBox of itemBoxes.toArray()) {
        const itemBox = $(_itemBox)
        const infoBox = itemBox.find('.info-box')
        const detailBox = infoBox.find('.detail-box')
        const info = infoBox.text()
        const [_, size, type, file_size] = info.match(/(\d+x\d+) (\S+) (\S+)/)
        const children = itemBox.children()
        if (children.length > 0) {
            const anchors = detailBox.find('a')
            const title = $(anchors[0])
            const author = $(anchors[1])
            result.push({
                title: title.text(),
                author: author.text(),
                artwork_url: title.attr('href'),
                author_url: author.attr('href'),
                from: detailBox.find('small').text().trim(),
                size, 
                type,
                file_size
            } as ASCII2DResultData_Item)
        }
    }
    return result
}
export interface ASCII2DResultData_Item {
    title: string,
    author: string,
    from: ASCII2DSourceType
    /**作品链接 */
    artwork_url: string
    /**作者主页链接 */
    author_url: string
    size:string
    type:string
    file_size:string
}
export type ASCII2DResultData = {
    /**搜索结果的原始Url */
    url: string,
    /**搜索结果 */
    results: Array<ASCII2DResultData_Item>
    searchMode: ASCII2DSearchMode
}
/**
 * 
 * @param hash image hash
 * @param searchMode 'color' or 'bovw'
 * @param returnAll numbers of results you want, or pass not-numeric value(except those equal to false) to return all of them
 * @returns 
 */
export async function searchByHash(hash: string, searchMode: ASCII2DSearchMode = "color", returnAll = 5) {
    const url = concatUrl(ASCII2D_BASE_URL, 'search', searchMode, hash)
    const resp = await fetch(url, {
        headers: {
            'User-Agent': USER_AGENT,
        }
    })
    if (resp.ok) {
        return {
            url,
            results: parseResult(await resp.text(), returnAll),
            searchMode,
        }
    } else {
        throw httpError(resp)
    }
}
/**
 * 
 * @param pic buffer of the picture
 * @param searchMode
 * @param digestLocally digest by ASCII2D API or digest locally
 * @param returnAll 解析前几个结果，为true时解析全部结果
 * @returns
 */
export async function searchByBuffer(pic: Buffer, searchMode: ASCII2DSearchMode = "color", digestLocally: boolean, returnAll = 5) {
    const hash = await (digestLocally ? getSearchHashLocal(pic) : getSearchHash(pic))
    return searchByHash(hash, searchMode, returnAll)
}
export async function searchByUrl(url: string, searchMode: ASCII2DSearchMode = "color", digestLocally: boolean, returnAll = 5) {
    if (digestLocally) {
        const resp = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
            }
        })
        if (resp.ok) {
            const pic = await resp.buffer()
            return searchByHash(await getSearchHashLocal(pic), searchMode, returnAll)
        } else {
            throw httpError(resp)
        }
    } else {
        const hash = await getSearchHash(url)
        return searchByHash(hash, searchMode, returnAll)
    }
}