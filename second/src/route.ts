import { Get, Handler, Req, Res } from "./decorator";

@Handler('/greeting')
export class Greeting {
    private greeting: string = 'Hello World'

    @Get()
    hello(req: Req, res: Res) {
        res.end(this.greeting)
    }
}