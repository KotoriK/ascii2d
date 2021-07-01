export class HTTPError extends Error {
    code: number
    constructor(code: number, desc: string) {
        super(desc)
        this.code = code
    }
}
export class FinderError extends Error{
    constructor(code:number){
        super(code as any)
    }
}