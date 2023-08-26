import { DirectedDiagram, LinkMeta } from "./types";

export class Hierarchy{
    constructor(
        data:DirectedDiagram
    ){
        this.id = data[0].id
        this.version = data[0].version
        this.dir = data[0].dir
        this.meta = data[0].meta
        this.requiring = data[0].requiring
        this.requiredBy = data[0].requiredBy

        this.children = this.trans(data,0)
    }

    id: string;
    version: string;
    dir: string | null;
    meta: LinkMeta[];
    requiring: number[];
    requiredBy: number[];
    children?:object[]

    trans(data:DirectedDiagram, index:number) {
        const root = data[index];
        const total = root.requiring.map((childIndex) => {
          const child = data[childIndex]
          if(child.requiring.length){
            const children = []
            let temp = this.trans(data,childIndex)
            temp.forEach(e=>{
                children.push(e)
            })
            return Object.assign(child,{"children":children})
          }
          else{
            return child
          }
        });

        // 添加value
        function func(data:any) {
            data.forEach((item:any) => {
            if (!item.children) {
                item.value = Number((Math.random() * 100).toFixed(0))
            }
            else {
                func(item.children)
            }
            })
        }
        func(total)
        
        return total
      }
}