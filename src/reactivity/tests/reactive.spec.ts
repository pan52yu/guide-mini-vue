import { reactive } from "../reactive"

describe("reactive", () => {
  it("happy path", () => {
    // 原始数据
    const original = { foo: 1 }
    // 观察到的数据
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })
})
