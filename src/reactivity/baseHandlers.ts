import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (!isReadonly) {
      // 收集依赖
      track(target, key)
    }
    return res
  }
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandler = {
  get,
  set,
}

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set failed`)
    return true
  },
}
