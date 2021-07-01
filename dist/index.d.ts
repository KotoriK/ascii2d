/// <reference types="node" />
export declare const MODULE_NAME = "ascii2d";
export declare type ASCII2DSearchMode = 'color' | 'bovw';
export declare type ASCII2DSourceType = 'pixiv' | 'twitter' | 'amazon' | 'dlsite' | 'tinami' | 'ニコニコ静画';
export interface ASCII2DResultData_Item {
    title: string;
    author: string;
    from: ASCII2DSourceType;
    /**作品链接 */
    artwork_url: string;
    /**作者主页链接 */
    author_url: string;
    size: string;
    type: string;
    file_size: string;
}
export declare type ASCII2DResultData = {
    /**搜索结果的原始Url */
    url: string;
    /**搜索结果 */
    results: Array<ASCII2DResultData_Item>;
    searchMode: ASCII2DSearchMode;
};
/**
 *
 * @param hash image hash
 * @param searchMode 'color' or 'bovw'
 * @param returnAll numbers of results you want, or pass not-numeric value(except those equal to false) to return all of them
 * @returns
 */
export declare function searchByHash(hash: string, searchMode?: ASCII2DSearchMode, returnAll?: number): Promise<{
    url: string;
    results: ASCII2DResultData_Item[];
    searchMode: ASCII2DSearchMode;
}>;
/**
 *
 * @param pic buffer of the picture
 * @param searchMode
 * @param digestLocally digest by ASCII2D API or digest locally
 * @param returnAll 解析前几个结果，为true时解析全部结果
 * @returns
 */
export declare function searchByBuffer(pic: Buffer, searchMode: ASCII2DSearchMode, digestLocally: boolean, returnAll?: number): Promise<{
    url: string;
    results: ASCII2DResultData_Item[];
    searchMode: ASCII2DSearchMode;
}>;
export declare function searchByUrl(url: string, searchMode: ASCII2DSearchMode, digestLocally: boolean, returnAll?: number): Promise<{
    url: string;
    results: ASCII2DResultData_Item[];
    searchMode: ASCII2DSearchMode;
}>;
