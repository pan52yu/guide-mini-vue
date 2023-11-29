import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { ReactiveFlags, reactive, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)
    if (shallow) {
      return res
    }
    // 如果是对象，则递归调用 reactive 或 readonly
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
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
  set(target, key) {
    console.warn(`key:${key} set failed`)
    return true
  },
}

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet,
})
