import { Get, Handler, Req, Res } from "./decorators/handlerDec";
import { ParseArgs } from "./decorators/parseArgs";
import { ReturnJson } from "./decorators/parserDec";

@Handler('/greeting')
export class Greeting {
    private greeting: string = 'Hello World'

    @Get()
    base(req: Req, res: Res) {
        res.end(this.greeting)
    }

    @Get("/world")
    @ReturnJson
    world(req: Req, res: Res) {
        console.log('from world')
        return { greeting: "welcome " }
    }

    @Get("/hello")
    @ParseArgs()
    @ReturnJson
    hello(req: Req, res: Res, args: any) {
        console.log(args)
        return { greeting: "welcome " }
    }
}