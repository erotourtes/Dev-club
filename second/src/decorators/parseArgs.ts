import { HOST } from "../../main"
import { Req, Res } from "./handlerDec"

const wrapped = (handler: any) => (req: Req, res: Res) => {
    console.log('from parse args', req.url)
    const url = new URL(req.url!, HOST)
    const params = url.searchParams
    const args = Object.fromEntries(params.entries())

    handler(req, res, args)
}

export function ParseArgs() {
    return function (prototype: any, key: string) {
        const handler = prototype[key].bind(prototype)

        // TODO: fix bindings
        prototype[key] = wrapped(handler).bind(prototype)
    }
}