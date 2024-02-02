import { HOST } from "../../main";
import { Req, Res } from "./handler";

const wrapped =
  (handler: any, hasTransport: boolean) =>
  async (req: Req, res: Res, ...args: any) => {
    const url = new URL(req.url!, HOST);
    const params = Object.fromEntries(url.searchParams.entries());

    if (hasTransport) return await handler(req, res, params, ...args);
    else return await handler(params, ...args);
  };

export function ParseArgs(hasTransport: boolean = true) {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    // TODO: fix bindings
    prototype[key] = wrapped(handler, hasTransport).bind(prototype);
  };
}
