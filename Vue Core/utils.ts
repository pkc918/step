/**
 * Vue core 内部封装的一些工具函数
 */

function warn(msg: string, ...args: any[]): void{
    console.warn(`[Vue warn] ${msg}`, ...args)
}

// compare whether a value has changed, accounting for NaN.
// Object.is
export const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)