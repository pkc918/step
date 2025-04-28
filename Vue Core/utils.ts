/**
 * Vue core 内部封装的一些工具函数
 */

function warn(msg: string, ...args: any[]): void{
    console.warn(`[Vue warn] ${msg}`, ...args)
}