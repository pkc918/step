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
    private _rawValue: T // 原始对象

    dep: Dep = new Dep() // 每个 ref 都初始化了一个 dep

    public readonly [ReactiveFlags.IS_REF] = true
    public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false // 这里需要给 boolean 类型，不然类型就是 false

    constructor(value: T, isShallow: boolean){
        this.rawValue = isShallow ? value : toRaw(value) // 记录原始对象，如果是 shallow 就直接记录本身，如果不是，就获取原始对象记录
        this._value = isShallow ? value : toReactive(value) // 初始化值的时候，如果不是 shallow 那就是一个代理对象
        this[ReactiveFlags.IS_SHALLOW] = isShallow
    }

    // ref.value
    get value(){
        this.dep.track()
        return this._value
    }

    set value(newValue){
        const oldValue = this._rawValue // 获取当前值
        const useDirectValue = this[ReactiveFlags.IS_SHALLOW] || isShallow(newValue) || isReadonly(newValue) // 判断是否是 ShallowRef 或者 readonly
        newValue = useDirectValue ? newValue : toRaw(newValue) // toTaw 获取原始对象

        if(hasChanged(newValue, oldValue)) {
            this._rawValue = newValue // 如果更新的值有变化，就更新原始对象值
            // 更新当前值，如果是 shallow readonly 直接更新值，如果不是，那就转一个 代理对象
            this._value = useDirectValue ? newValue : toReactive(newValue) // toReactive 返回了一个代理对象

            this.dep.trigger()
        }
    }
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

封装一个对比变化的函数，看是否改变了 hasChanged


### Ref 的实现
初始化的时候，会记录原始对象（私有属性），和一个代理对象（公共属性）在属性上

获取值：通过 .value 获取值的时候，直接返回这个代理对象
更新值：会使用 Object.is 方法判断当前值，和之前的原始对象是否是同一个对象，如果不是同一个对象，就更新逻辑，首先更新原始对象为当前设置的对象，其实再更新代理对象为当前的对象 `ref.value = {}` set的对象不是一个代理对象，所以需要先转化成代理对象才会存进去