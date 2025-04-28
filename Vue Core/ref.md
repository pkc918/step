ref 是一个函数，函数返回了一个 RefImpl 实例，返回实例又封装了一个工厂函数 createRef

```ts
// 工厂函数
function createRef(rawValue: unknown, shallow: boolean) {
    if (isRef(rawValue)) {
        return rawValue // 代码风格，提前返回
    }
    return new RefImpl(rawValue, shallow)
}
```

```ts
// T 如果不是固定类型，一般默认为 any
class RefImpl<T = any> {
    _value: T

    public readonly [ReactiveFlags.IS_REF] = true
    public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false // 这里需要给 boolean 类型，不然类型就是 false

    constructor(value: T, isShallow: boolean){
        this._value = value // 初始化存储值
        this[ReactiveFlags.IS_SHALLOW] = isShallow
    }

    get value(){
        return this._value
    }

    set value(newValue){}
}
```

flag一些标记信息都是用 enum 创建
```ts
enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    IS_SHALLOW = '__v_isShallow',
    RAW = '__v_raw',
    IS_REF = '__v_isRef',
}
```