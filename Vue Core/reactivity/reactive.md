rective 函数

```ts
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}

function createReactiveObject(
  arget: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
    if(!isObject(target)) return target

    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }

    const proxy = new Proxy(
        target,
        targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
    )
    // 存储代理对象，原对象为 key，代理对象为 value
    proxyMap.set(target, proxy)
    return proxy
}
```

mutableHandlers 和 mutableCollectionHandlers 都是一个对象

```ts
mutableCollectionHandlers = {
    get(target: Target, key: string | symbol, receiver: object): any{
        const res = Reflect.get(
            target,
            key,
            isRef(target) ? target : receiver
        )

        if(!isReadonly) {
            track(target, ???, key)
        }


        return res
    }
    
    set(target, key, value, receiver){ 
        const result = Reflect.set(
            target,
            key, 
            value, 
            isRef(target) ? target : receiver
        )

        return result

        
    }
    deleteProperty(){}
    has(){}
    ownKeys(){}
}
```