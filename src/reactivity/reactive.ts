import { mutableHandler, readonlyHandler, shallowReadonlyHandler } from "./baseHandlers"

export const enum ReactiveFlags {
  // 是否是响应式对象
  IS_REACTIVE = "__v_isReactive",
  // 是否是只读对象
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler)
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandler)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createReactiveObject(raw, baseHandler) {
  return new Proxy(raw, baseHandler)
}
