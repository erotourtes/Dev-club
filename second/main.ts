import * as http from "http";
import { routerMap } from "@/decorators/handler";
import { Greeting } from "@/route";

const modules = [Greeting];

export const PORT = 8000;
export const HOST = "http://localhost";

http
  .createServer((req, res) => {
    const { url, method } = req;
    const path = new URL(url || "", `${HOST}:${PORT}`);
    const handlerId = `${method}:${path.pathname}`;
    const handler = routerMap.get(handlerId);
    if (handler) {
      try {
        handler(req, res);
      } catch (error) {
        console.error(error);
        // @ts-ignore
        res.statusCode = error.status || 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Something wrong happend" }));
      }
      return;
    }

    const keyString = Array.from(routerMap.keys()).join(", ");
    res.end(`404 ${keyString}`);
  })
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
