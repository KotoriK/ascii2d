import {ASCII2D_BASE_URL, USER_AGENT} from './config'
import Cheerio from 'cheerio'
import fetch from 'node-fetch'

export async function getAuthToken(): Promise<string> {
    const body = await (await fetch(ASCII2D_BASE_URL, {
        headers: {
            'User-Agent': USER_AGENT,
        }
    })).text();
    const $ = Cheerio.load(body)
    return $('meta[name="csrf-token"]').attr('content')
}