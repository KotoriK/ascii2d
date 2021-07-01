"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = void 0;
const tslib_1 = require("tslib");
const config_1 = require("./config");
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
async function getAuthToken() {
    const body = await (await node_fetch_1.default(config_1.ASCII2D_BASE_URL, {
        headers: {
            'User-Agent': config_1.USER_AGENT,
        }
    })).text();
    const $ = cheerio_1.default.load(body);
    return $('meta[name="csrf-token"]').attr('content');
}
exports.getAuthToken = getAuthToken;
