import { Context } from "./decorators/contextDec";
import { Get, Handler, Req, Res } from "./decorators/handlerDec";
import { ParseArgs } from "./decorators/parseArgs";
import { ParseBody } from "./decorators/parseBody";
import { ReturnJson } from "./decorators/parserDec";

@Handler("/greeting")
export class Greeting {
  private greeting: string = "Hello World";

  @Get()
  base(req: Req, res: Res) {
    res.end(this.greeting);
  }

  @Get("/world")
  @ReturnJson
  world(req: Req, res: Res) {
    console.log("from world");
    return { greeting: "welcome " };
  }

  @Get("/hello")
  @ParseArgs()
  @ReturnJson
  hello(req: Req, res: Res, args: any) {
    console.log(args);
    return { greeting: "welcome " };
  }

  @Get("/pluto")
  @ParseArgs()
  @ParseBody()
  @ReturnJson
  pluto(req: Req, res: Res, body: any, args: any) {
    console.log(args, body);
    return { greeting: "welcome " };
  }

  @Get("/mars")
  @Context()
  @ParseArgs()
  @ParseBody()
  @ReturnJson
  mars(req: Req, res: Res, body: any, args: any, context: any) {
    console.log(args, body, context);
    return { greeting: "welcome " };
  }
}
