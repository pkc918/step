```ts
class Link{
    constructor(public sub, puiblic: dep{
        
    })
}
class Dep{

    activeLink?: Link = undefined // 当前激活的链表

    subs?: Link = undefined // 链表尾
    subHead?: Link // 链表头，为了顺序调用
    
    constructor(public computed?: ComputedRefImpl | undefined){
        this.subHead = undefined 
    }

    track(debugInfo?: DebuggerEventExtraInfo): Link | undefined {
        let link = this.activeLink
        // 第一次 获取值的时候，会进行track，一定会进入这个逻辑
        if (link === undefined) {
            // 创建一个新的链表
            link = this.activeLink = new Link(activeSub, this)

            addSub(link) // link 和 link.dep.subs 双向绑定，更新 subs 的值指向 link
        }

        onTrack()
    }

    trigger(){
        this.notify()
    }

    notify(){
        // 从头节点开始执行trigger
       for (let head = this.subsHead; head; head = head.nextSub) {
            head.sub.onTrigger()
       }
    }
}
```

Link 和 Dep循环引用，link第二个参数是一个 dep