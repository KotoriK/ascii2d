import test from "tape";
import { getSearchHash, getSearchHashLocal } from "../src/digest";
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { getAuthToken } from "../src/token";
import { ASCII2DResultData, searchByHash } from "../src";
test('get csrf token', async (t) => {
    const auth = await getAuthToken()
    t.assert(typeof auth != 'undefined')
    t.comment(auth)
})
let img_hash: Promise<string>
const img_path = resolve('./test/images/84035784_p2.jpg')
const img = readFile(img_path)
test('ascii2d', async (t) => {
    const hash = img.then(buf => getSearchHashLocal(buf))
    img_hash = getSearchHash('https://pixiv.cat/84035784-3.jpg')
    t.assert(typeof (await img_hash) != 'undefined', 'get hash by url successed')
    t.assert((await hash) === (await img_hash), 'get hash by local successed')
    t.comment('hash:'+await hash)
    const result = await searchByHash(await img_hash, 'color')
    t.assert(result.results.length > 0)
    const item = result.results[0]
    t.assert(typeof item.author != 'undefined')
    t.assert(typeof item.from != 'undefined')
    t.assert(typeof item.title != 'undefined')
    t.comment(JSON.stringify(result,undefined,2))
})
