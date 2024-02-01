import { HOST } from "../../main";
import { Req, Res } from "./handler";

const wrapped =
  (handler: any) =>
  async (req: Req, res: Res, ...args: any) => {
    const url = new URL(req.url!, HOST);
    const params = Object.fromEntries(url.searchParams.entries());

    return await handler(req, res, params, ...args);
  };

export function ParseArgs() {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    // TODO: fix bindings
    prototype[key] = wrapped(handler).bind(prototype);
  };
}
