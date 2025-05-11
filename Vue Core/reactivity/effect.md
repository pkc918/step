dep 是表示指向响应式元对象
sub 是元对象指向的 link
deps 是 effect 中存储的 link 和 sub对应


### 链表复用

假设之前收集顺序是 effect.deps = dep1 => dep2(depsTail)

第二次执行的时候，我会把 effect.depsTail 设置成undefined

有两种情况需要复用：
1. 下次执行的时候 effect.depsTail 是 undefined，effect.deps 是 dep1，此时 effect 的肯定还是会先收集 dep1，然后进来的时候看一下，effect.deps 有，effect.depsTail 没有，这个时候就表示是需要复用头结点，看一下头节点是不是等于 dep1，如果等于，就复用它，复用成功后，需要把 effect.depsTail 指向 dep1，此时的依赖关系是 effect.deps = dep1, dep1.nextDep = dep2，effect.depsTail = dep1，注意这个时候 effect.depsTail是有nextDep的

2. 尾节点有，并且尾节点还有 nextDep，这个时候是轮到 dep2收集了，然后dep2要跟 effect.depsTail.nextDep 做复用，他俩相等，复用 dep2，然后 effect.depsTail 指向 dep2

到这里，effect就执行完了


```ts
// 第一次
let flag = false
effect(() => {
    dep1.value
    if(flag){
        dep3.value
    }
    dep2.value
})

// 第二次
flag = true
effect(() => {
    dep1.value
    if(flag){
        dep3.value
    }
    dep2.value
})
```

#### 第一次
执行 effect 创建一个 effect
遇到 dep1.value，创建link1，收集link1, effect.deps 指向 link1
遇到 dep2.value，创建link2，收集link2, effect.deps 指向 link1，但是link1 有个 nextDep 会连接 dep2，同时 effect 的depsTail 指向dep2
依赖收集完毕

### 第二次
基于第一次的结果上进行更新，首先会将 depsTail 设置undefined
拿到 effect.deps 判断是否有值，有值就代表已经收集过了，此时是修改ref出发的依赖更新
首先对比当前的 dep === effect.deps.dep 如果相等，那就是同一个源对象触发，将 depTail 指向 effect.deps
第二次遇到了 dep3，此时 effect.depsTail.nextDep 是link2，link2.dep 是 dep2 所以不相等，不想等就会新建一个 link3，然后将 link3 插入在 depsTail.nextDep 上，但是 link2 暂时不会删除，会把 link2 放在 link3 之后连接
再次往后执行，碰到了dep2，此时继续对比 effect.depsTail.nextDep.dep === dep2 刚好link2是接在了 depsTail.nextDep 上，所以相等


### 避免递归无线循环收集
给 RectiveEffect 新增一个 traking 属性，让追踪的时候设置 true，追踪完成后，将traking 设置 false，也就是在 effect 里面多次执行收集，只要是当前effect没有执行完，只会收集一次

