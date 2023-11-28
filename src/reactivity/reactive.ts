import { mutableHandler, readonlyHandler } from "./baseHandlers"

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler)
}

function createReactiveObject(raw, baseHandler) {
  return new Proxy(raw, baseHandler)
}
