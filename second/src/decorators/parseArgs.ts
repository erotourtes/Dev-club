import { HOST } from "../../main"
import { Req, Res } from "./handlerDec"

const wrapped = (handler: any) => (req: Req, res: Res, ...args: any) => {
    console.log('from parse args', req.url)
    const url = new URL(req.url!, HOST)
    const params = Object.fromEntries(url.searchParams.entries())

    handler(req, res, params, ...args)
}

export function ParseArgs() {
    return function (prototype: any, key: string) {
        const handler = prototype[key].bind(prototype)

        // TODO: fix bindings
        prototype[key] = wrapped(handler).bind(prototype)
    }
}