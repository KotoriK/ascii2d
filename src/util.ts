import { Response } from "node-fetch"
import { Readable } from "stream"
import { HTTPError } from "./err"
export const concatUrl = (...urls: string[]) => urls.map(url => {
    const _url = url.startsWith('/') ? url.substr(1) : url
    return _url.endsWith('/') ? _url.substr(0, _url.length - 1) : _url
}).join('/')
export function readStream(stream: Readable) {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: any[] = []
        stream.on('data', (chunk) => {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
        })
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
    })
}
export function httpError(resp: Response) {
    return new HTTPError(resp.status, resp.statusText)
}