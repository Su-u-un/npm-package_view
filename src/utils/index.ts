// import {join} from "path"
import {store} from '@/store.js'
import {marked} from 'marked'

// 传入点击得到的节点信息，传入所有依赖的数据
export function readme(uri,nodes){
  console.log(uri,nodes);
  
  // 得到数据
  const {data} = uri
  // 被谁依赖
  let parent = []
  data.requiredBy.forEach(item=>{
    // 查询得到被依赖的名称，加入parent数组
    parent.push(nodes[item].id)
  })
  // 依赖谁?---这里用上element的虚拟树形控件
  let children = []
  for(let i = 0;i<data.requiring.length;i++){
    const meta = data.meta[i]
    const key = data.requiring[i]
    let obj = {
      name : nodes[key].id,
      range : meta.range,
      type : meta.type,
      optional : meta.optional,
    }
    children.push(obj)
  }
  
    let b = data.dir + '/' + data.id + '/readme.md'
    let a = data.dir + '/' + data.id + '/package.json'
  
    fetch(b).then(res=>res.text()).then(
      data=>{
        let temp = marked(data)
        store.readme = temp
      }).catch(err=>err)
  
    fetch(a).then(res=>res.json()).then(
      data=>{
        store.data = {
          name:data.name,
          description:data.description,
          parent:parent,
          children:children
        }
      }).catch(err=>err)
  
  
}
// 收起节点，清空信息
export function clear(){
  store.data = {}
  store.readme = ''
}