import { Get, Handler, Req, Res } from "./decorators/handlerDec";
import { ReturnJson } from "./decorators/parserDec";

@Handler('/greeting')
export class Greeting {
    private greeting: string = 'Hello World'

    @Get()
    hello(req: Req, res: Res) {
        res.end(this.greeting)
    }

    @Get("/world")
    @ReturnJson
    world(req: Req, res: Res) {
        console.log('from world')
        return { greeting: "welcome " }
    }
}