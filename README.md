# ascii2d
Node.js wrapper for ascii2d.net
## Installation
```bash
npm i https://github.com/KotoriK/ascii2d
```
## Usage
```ts
import {searchByHash} from 'ascii2d'
/**
 * @param hash image hash
 * @param searchMode 'color' or 
 * @param returnAll numbers of results you want, or pass not-numeric value(except those equal to false) to return all of them
 */
searchByHash('273a0c5b96e09f4bad06c8041585ffc0','color',true)
//alternative: searchByUrl(), searchByBuffer()
searchBy
```
### Example Returns 
```jsonc
{
    "url":"https://ascii2d.net/search/color/273a0c5b96e09f4bad06c8041585ffc0",
    "results":[
         {
             "title": "泳装",
             "author": "QuAn_",
             "artwork_url": "https://www.pixiv.net/artworks/84035784",
             "author_url": "https://www.pixiv.net/users/6657532",
             "from": "pixiv",
             "size": "1703x2459",
             "type": "JPEG",
             "file_size": "2550.9KB"
             },
    ],
    "searchMode": "color"
}
```
## TODO
* support [Agent](https://nodejs.org/api/http.html#http_class_http_agent)
* user agent changeable
* ascii2d base path changeable