import { HOST } from "../../main";
import { Req, Res } from "./handler";

const wrapped =
  (handler: any, hasTransport: boolean) =>
  async (req: Req, res: Res, ...args: any) => {
    const buffer = [];
    for await (const chunk of req) {
      buffer.push(chunk);
    }

    const body = Buffer.concat(buffer).toString();

    const isJson = req.headers["content-type"] === "application/json";
    if (!isJson) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "invalid content type" }));
      return;
    }

    let json;
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = {};
    }

    if (hasTransport) return await handler(req, res, json, ...args);
    else return await handler(json, ...args);
  };

export function ParseBody(hasTransport: boolean = true) {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    // TODO: fix bindings
    prototype[key] = wrapped(handler, hasTransport).bind(prototype);
  };
}
