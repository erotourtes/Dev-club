import * as http from "http";
import { Handler, routerMap } from "@/decorator";
import { Greeting } from "@/route";

const modules = [Greeting];

const PORT = 8000;
const HOST = "http://localhost";

http
    .createServer((req, res) => {
        const { url, method } = req;
        const path = new URL(url || "", `${HOST}:${PORT}`);
        const handlerId = `${method}:${path.pathname}`;
        const handler = routerMap.get(handlerId);
        if (handler) {
            return void handler(req, res);
        }

        const keyString = Array.from(routerMap.keys()).join(", ");
        res.end(`404 ${keyString}`);
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));