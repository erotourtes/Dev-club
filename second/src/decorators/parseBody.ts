import { HOST } from "../../main";
import { Req, Res } from "./handler";

const wrapped =
  (handler: any) =>
  async (req: Req, res: Res, ...args: any) => {
    const buffer = [];
    for await (const chunk of req) {
      buffer.push(chunk);
    }

    const body = Buffer.concat(buffer).toString();

    const isJson = req.headers["content-type"] === "application/json";
    if (isJson) {
      try {
        const json = JSON.parse(body);
        handler(req, res, json, ...args);
      } catch (error) {
        handler(req, res, {}, ...args);
      }
    }
  };

export function ParseBody() {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    // TODO: fix bindings
    prototype[key] = wrapped(handler).bind(prototype);
  };
}
