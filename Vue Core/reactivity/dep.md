ts小技巧：共有属性可以直接在class的constructor中定义，参考Link源码
```ts
class Link {
    constructor(
        public sub
    )
}

(new Link).sub
```

```ts
class Dep{

    activeLink?: Link = undefined // 当前激活的链表

    subHead?: Link // 链表头，为了顺序调用
    
    constructor(public computed?: ComputedRefImpl | undefined){
        this.subHead = undefined 
    }

    track(debugInfo?: DebuggerEventExtraInfo): Link | undefined {
        let link = this.activeLink
        // 第一次 获取值的时候，会进行track，一定会进入这个逻辑
        if (link === undefined) {
            // 创建一个新的链表
            link = this.activeLink = new Link(this)

            addSub(link)
        }
    }

    
}

```
