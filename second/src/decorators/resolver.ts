import { ParseArgs } from "./parseArgs";
import { ParseBody } from "./parseBody";
import { Context } from "./context";
import { Req, Res } from "./handler";

export function ResolverBAC(hasTransport: boolean = false) {
  return function (prototype: any, key: string) {
    ParseBody(hasTransport)(prototype, key);
    ParseArgs()(prototype, key);
    Context()(prototype, key);

    const handler = prototype[key].bind(prototype);
  };
}
