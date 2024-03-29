import { Req, Res } from "./handler";

const parseLanguages = (req: Req) => {
  const languages = req.headers["accept-language"];
  if (!languages) return [];
  return languages.split(",").map((l) => l.trim());
};

const wrapped =
  (handler: any) =>
  async (req: Req, res: Res, ...args: any) => {
    const context = {
      languages: parseLanguages(req),
      userAgent: req.headers["user-agent"],
    };
    return await handler(req, res, context, ...args);
  };

export function Context() {
  return function (prototype: any, key: string) {
    const handler = prototype[key].bind(prototype);

    prototype[key] = wrapped(handler).bind(prototype);
  };
}
