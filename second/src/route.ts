import { Get, Handler, Req, Res, routerMap } from "./decorators/handler";
import { ReturnJson } from "./decorators/parsers";
import { ResolverBAC, ResolverAC } from "./decorators/resolver";

@Handler("/greeting")
export class Greeting {
  private greeting: string = "Hello World";

  // @Get("/mars")
  // @Context()
  // @ParseArgs()
  // @ParseBody()
  // @ReturnJson
  // mars(req: Req, res: Res, body: any, args: any, context: any) {
  //   console.log(args, body, context);
  //   return { greeting: "welcome " };
  // }

  @Get()
  @ReturnJson
  @ResolverBAC()
  base(body: any, args: any, context: any) {
    return {
      body,
      args,
      context,
    };
  }

  @Get("/jupiter")
  @ReturnJson
  @ResolverBAC()
  jupiter(body: any, args: any, context: any) {
    console.log(body, args, context);
    return { greeting: "welcome " };
  }
}

@Handler("/")
export class Base {
  @Get()
  @ReturnJson
  @ResolverAC()
  base(args: any, context: any) {
    const routes = Array.from(routerMap.keys()).sort().join(", ");
    return {
      routes,
      args,
      context,
    };
  }
}
