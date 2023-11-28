import { extend } from "../shared"

// 当前正在执行的响应函数
let activeEffect
// 标识是否应该收集依赖
let shouldTrack = true
class ReactiveEffect {
  private _fn: any
  deps = [] // 存储当前响应函数依赖的所有属性的集合
  active = true // 标识当前响应函数是否激活
  onStop?: () => void /// 停止时的回调函数
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  // 执行响应函数
  run() {
    if (!this.active) return this._fn() // 如果当前响应函数不是激活状态，则直接执行响应函数

    shouldTrack = true // 标记为应该收集依赖
    activeEffect = this // 将当前响应函数实例赋值给 activeEffect

    const result = this._fn() // 执行响应函数
    shouldTrack = false // 标记为不应该收集依赖
    return result
  }
  // 停止响应函数
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop() // 如果有 onStop 回调函数, 则执行
      }
      this.active = false // 标记为非激活状态
    }
  }
}

// 清理响应函数，移除所有依赖
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

// 全局的依赖映射表
const targetMap = new Map()
// 收集依赖
export function track(target, key) {
  if (!isTracking()) return // 如果不应该收集依赖，则直接返回

  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if(dep.has(activeEffect)) return // 如果当前属性已经收集过依赖，则直接返回
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

// 判断是否应该收集依赖
function isTracking() {
  // 返回 true 则表示应该收集依赖
  return shouldTrack && activeEffect !== undefined
}

// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

// 创建并管理一个反应式效应（Reactive Effect）
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // Object.assign(_effect, options)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

// 停止响应函数
export function stop(runner) {
  runner.effect.stop()
}
