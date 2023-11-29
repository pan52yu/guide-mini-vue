// Path: src/shared/index.ts
/**
 * 扩展对象
 */
export const extend = Object.assign

/**
 * 判断是否是对象
 * @param val 
 * @returns 是否是对象
 */
export const isObject = (val) => typeof val === "object" && val !== null

/**
 * 判断两个值是否相等
 * @param oldValue
 * @param newValue
 * @returns 是否相等
 */
export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)
