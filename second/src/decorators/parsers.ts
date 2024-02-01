import { json } from "stream/consumers";
import { Req, Res } from "./handler";

const contentTypes = {
  json: "application/json",
  text: "text/plain",
  html: "text/html",
  xml: "application/xml",
};

const wrapped = (handler: any, contentType: string) =>
  async function (req: Req, res: Res, ...args: any) {
    const isAsync = handler.constructor.name === "AsyncFunction";
    let result;
    if (isAsync) {
      result = await handler(req, res, ...args);
    } else {
      result = handler(req, res, ...args);
    }

    console.log(result);

    res.setHeader("Content-Type", contentType);
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  };

function ReturnParserFactory(returnType: keyof typeof contentTypes) {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    if (!(returnType in contentTypes)) throw new Error("Invalid return type");
    const contentType = contentTypes[returnType];

    // TODO: fix bindings
    prototype[key] = wrapped(handler, contentType).bind(prototype);
  };
}

export const ReturnJson = ReturnParserFactory("json");
