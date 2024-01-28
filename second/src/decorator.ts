import {
    IncomingMessage,
    ServerResponse as Response,
} from "http"
import "reflect-metadata";
import Path from "node:path"

export type Res = Response<IncomingMessage>
export type Req = IncomingMessage

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Handler = (req: IncomingMessage, res: Response) => void
type Path = string
type ReflectMap = Map<Handler, [Method, Path]>

export const routerMap = new Map()
const instanceMap = new Map()

export function Handler(basePath: string) {
    return function (constructor: Function) {
        if (!instanceMap.has(constructor)) {
            // @ts-ignore
            const instance = new constructor()
            instanceMap.set(constructor, instance)
        }

        const instance = instanceMap.get(constructor)

        const map = Reflect.getMetadata('map', constructor.prototype) || new Map() as ReflectMap

        for (const [handler, [method, path]] of map.entries()) {
            const fullPath = Path.join(basePath, path)
            routerMap.set(`${method}:${fullPath}`, handler.bind(instance))
        }
    }
}

function MethodFactory(method: string) {
    return function (path: string = '') {
        return function (prototype: any, key: string) {
            const handler = prototype[key]

            const map = Reflect.getMetadata('map', prototype) || new Map()
            map.set(handler, [method, path])

            Reflect.defineMetadata('map', map, prototype)
        }
    }
}

export const Get = MethodFactory('GET')