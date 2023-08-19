import * as d3 from 'd3'
import {store} from "@/store.js"
import {readme} from '../utils'

// 参数的定义
interface Data {
  id: string,
  version: number,
  path: string,
  children: Data[]
  value?: number
}
interface Option {
  // 真实dom
  dom: HTMLElement
  duration?: number
  height?: number
  width?: number
}

// 组件的定义
interface View {
  // 初始化
  init: Function
}

function D3view(option: Option, data: Data) {
  return new view(option, data)
}

let i = 0

class view implements View {
  static panel:any
  static duration:number
  static root: any
  static nodes: any
  static links: any
  
  constructor(private settings: Option, private data: Data) {
    this.settings = Object.assign({
      width: 800,
      height: 800,
      duration: 800
    }, this.settings)
    view.duration = this.settings.duration!
    this.init()
  }
  init() {
    view.root = d3.hierarchy(this.data, d => d.children)
    view.root.x0 = 0
    view.root.y0 = 0
    
    view.root.children!.forEach(collapse)
    
    function collapse(d: any) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    template(this.settings)
    updateChart(view.root)
  }
  
}


function template(settings:Option) {
  // 创建svg
  const svg = d3
    .select(settings.dom)
    .append('svg')
    .attr('width', settings.width!)
    .attr('height', settings.height!)
    .attr('id','svg')
    .attr('viewBox',`-${settings.width/2},-${settings.height/2},${settings.width},${settings.height}`)
  // 创建视图
  view.panel = svg
    .append("g")
    .attr('transform', "translate(  0  ,  0 )")
  // 创建拖拽
  const zoom:any = d3
    .zoom()
    .scaleExtent([0.1, 100])
    .on("zoom", () => {
      view.panel.attr(
        "transform",
        "translate(" +
        (d3.event.transform.x) +
        "," +
        (d3.event.transform.y ) +
        ") scale(" +
        d3.event.transform.k +
        ")"
      );
    })
  // 绑定拖拽
  svg.call(zoom).on("dblclick.zoom", () => { })
  // 创建信息浮层
  const div = d3
    .select(settings.dom)
    .append('div')
    .attr('class','chartTooltip hidden')
  
  div.append('p').attr('class','name')
  div.append('p').attr('class','version')
}

function updateChart(source:any) {
  // 定义Tree层级，并设置宽高
  let treemap = d3.tree().nodeSize([50, 50]);
  // 设置节点的x、y位置信息
  let treeData = treemap(view.root);
  
  // 计算新的Tree层级
  let nodes = treeData.descendants()
  let links = treeData.descendants().slice(1);
  // 设置每个同级节点间的y间距为100
  nodes.forEach(function (d: any) {
    d.y = d.depth * 100;
  });
// 为动画过渡保存旧的位置
  
  updateNodes(source,nodes)
  updateLinks(source,links)
  nodes.forEach(function (d: any) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
  
}
function updateNodes(source: any,nodes:any) {
  // 给节点添加id，用于选择集索引
  const node = view.panel.selectAll("g.node").data(nodes, (d: any) => d.id || (d.id = ++i))
  
  // enter得到多于当前页面element的数据
  // 获取enter的数据，对这些数据进行处理
  let nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("id", (d: any) => { return d.id })
    // 默认位置为当前父节点的位置
    .attr("transform", function () {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    // 设置鼠标放置显示的浮层
    .on("mouseover", (d: any) => {
      // 从d3.event获取鼠标的位置
      let transform = d3.event;
      let yPosition = transform.offsetY + 20;
      let xPosition = transform.offsetX + 20;
      // 将浮层位置设置为鼠标位置
      let chartTooltip = d3
        .select(".chartTooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      // 更新浮层内容
      chartTooltip.select(".name").text('name：'+d.data.id);
      chartTooltip.select(".version").text('version：'+d.data.version);
      // 移除浮层hidden样式，展示浮层
      chartTooltip.classed("hidden", false);
    })
    // 鼠标离开隐藏浮层
    .on("mouseout", () => {
      // 添加浮层hidden样式，隐藏浮层
      d3.select(".chartTooltip").classed("hidden", true);
    })
    // 给每个新加的节点绑定click事件
    .on("click",click )
  
  // 给新的数据 绑定到新建的cycle元素上
  nodeEnter.append("circle")
    .attr("class", "node")
    .attr("r", 1e-6)
    // 如果元素有子节点，且为收起状态，则填充浅蓝色
    .style("fill", (d: any) => {
      return d._children ? "lightsteelblue" : d.data.children ? "#fff" : "#aaa";
    });
  
  // 给新加数据添加文字说明
  nodeEnter.append("text")
    .attr("dy", ".35em")
    .attr("x", (d: any) => {
      return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", (d: any) => {
      return d.children || d._children ? "end" : "start";
    })
    .text((d: any) => {
      return d.data.id;
    });
  
  // 把新数据和旧的数据用merge合并一下
  let nodeUpdate = nodeEnter.merge(node);
  
  // 设置节点的位置变化，添加过渡动画效果
  nodeUpdate
    .transition()
    .duration(view.duration)
    .attr("transform", function (d: any) {
      return "translate(" + d.y + "," + d.x + ")";
    });
  
  // 更新节点的属性和样式
  nodeUpdate
    .select("circle.node")
    .attr("r", 10)
    .style("fill", function (d: any) {
      return d._children ? "lightsteelblue" : d.data.children ? "#fff" : "#aaa";
    })
    .attr("cursor", "pointer");
  
  // 获得少于当前element的元素并操作
  let nodeExit = node
    .exit()
    // 添加过渡动画
    .transition()
    .duration(view.duration)
    .attr("transform", function (d:any) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    // 移除元素
    .remove();
  
  // exit集中节点的cycle元素尺寸变为0
  nodeExit.select("circle").attr("r", 1e-6);
  
  // exit集中节点的text元素可见度降为0
  nodeExit.select("text").style("fill-opacity", 1e-6);
}
function updateLinks(source: any,links:any) {
  // 更新数据
  let link = view.panel.selectAll("path.link").data(links, (d: any)=> d.id);
  
  // 添加enter操作，添加类名为link的path元素
  let linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    // 添加id
    .attr("id", (d: any) => {
      return "textPath" + d.id;
    })
    // .on("mouseover",  () => {
    //     d3.select(this).style("stroke", "orange");
    
    // })
    // .on("mouseout",  ()=> {
    //     d3.select(this).style("stroke", '#CCC');
    // })
    .on("click", (d: any) => {
      alert(d.parent.data.id + ' -> ' + d.data.id);
    })
    // 默认位置为当前父节点的位置
    .attr("d", function () {
      let o = {
        x: source.x0,
        y: source.y0
      };
      return diagonalReverse(o, o);
    });
  
  // enter操作中，添加text，同时添加与path匹配的textPath
  link
    .enter()
    .append("text")
    // 给text添加textPath元素
    .append("textPath")
    // 给textPath设置path的引用
    .attr("xlink:href", (d: any) => {
      return "#textPath" + d.id;
    })
  
  
  // 获取update集
  let linkUpdate = linkEnter.merge(link);
  
  // 更新添加过渡动画
  linkUpdate
    .transition()
    .duration(view.duration)
    .attr("d", function (d: any) {
      return diagonalReverse(d, d.parent);
    });
  // 获取exit集
  let linkExit = link
    .exit()
    // 设置过渡动画
    .transition()
    .duration(view.duration)
    .attr("d", function (d:any) {
      let o = {
        x: source.x,
        y: source.y
      };
      return diagonalReverse(o, o);
    })
    // 移除link
    .remove();
  
  // 添加贝塞尔曲线的path，方向为父节点指向子节点
  function diagonalReverse(s: any = {}, d: any = {}) {
    let path =
      `M ${d.y} ${d.x}
            C ${(s.y + d.y) / 2} ${d.x},
            ${(s.y + d.y) / 2} ${s.x},
            ${s.y} ${s.x}`;
    return path;
  }
}
function click(d: any) {
  if (d._clickid) {
    // 若在200ms里面点击第二次，则不做任何操作，清空定时器
    clearTimeout(d._clickid);
    d._clickid = null;
  } else {
    let eee =[
      {
        "dataIndex": 0,
        "data": {
          "id": "test-pkg",
          "version": "1.0.0",
          "path": "/home/runner/app/npm-package/test-pkg",
          "meta": [
            {
              "range": "^1.4.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^1.7.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^18.2.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^18.2.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^20.4.8",
              "type": "dev",
              "depthEnd": false,
              "optional": false,
              "invalid": true
            },
            {
              "range": "^8.46.0",
              "type": "dev",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^0.0.3",
              "type": "dev",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^6.1.3",
              "type": "dev",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^5",
              "type": "dev",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            }
          ],
          "requiring": [
            1,
            10,
            93,
            96,
            85,
            98,
            99,
            100,
            101
          ],
          "requiredBy": []
        },
        "vx": 0.0007975963699959673,
        "vy": -0.0020006145362939163,
        "x": 35.09860259269928,
        "y": 7.3424255063672845,
        "showNode": true,
        "showRequiring": true,
        "index": 0,
        "r": 7.25,
        "fx": null,
        "fy": null
      },
      {
        "dataIndex": 1,
        "data": {
          "id": "axios",
          "version": "1.4.0",
          "path": "node_modules",
          "meta": [
            {
              "range": "^1.15.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^4.0.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^1.1.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            }
          ],
          "requiring": [
            2,
            3,
            9
          ],
          "requiredBy": [
            0
          ]
        },
        "vx": 0.0009336320904315537,
        "vy": -0.0006382271462099497,
        "x": -111.88571692572961,
        "y": -20.455568979011407,
        "showNode": true,
        "showRequiring": true,
        "index": 1,
        "r": 4.0249999999999995,
        "fx": null,
        "fy": null
      },
      {
        "dataIndex": 2,
        "data": {
          "id": "follow-redirects",
          "version": "1.15.2",
          "path": "node_modules/.pnpm/node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            1
          ]
        },
        "vx": 0.0017020710964386595,
        "vy": 0.00004285873161187052,
        "x": -30.710933165424247,
        "y": 99.28128146354605,
        "showNode": true,
        "showRequiring": false,
        "r": 3.5,
        "index": 2
      },
      {
        "dataIndex": 3,
        "data": {
          "id": "form-data",
          "version": "4.0.0",
          "path": "node_modules",
          "meta": [
            {
              "range": "^0.4.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^1.0.8",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            },
            {
              "range": "^2.1.12",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            }
          ],
          "requiring": [
            4,
            5,
            7
          ],
          "requiredBy": [
            1
          ]
        },
        "vx": 0.001837281499021819,
        "vy": -0.002231733529702963,
        "x": 13.908752577163947,
        "y": 65.07693384635014,
        "showNode": true,
        "showRequiring": false,
        "r": 4.0249999999999995,
        "index": 3
      },
      {
        "dataIndex": 4,
        "data": {
          "id": "asynckit",
          "version": "0.4.0",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            3
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 5,
        "data": {
          "id": "combined-stream",
          "version": "1.0.8",
          "path": "node_modules",
          "meta": [
            {
              "range": "~1.0.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": false
            }
          ],
          "requiring": [
            6
          ],
          "requiredBy": [
            3
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 27,
        "data": {
          "id": "core-util-is",
          "version": "1.0.3",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            26
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 28,
        "data": {
          "id": "isarray",
          "version": "1.0.0",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            26
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 29,
        "data": {
          "id": "process-nextick-args",
          "version": "2.0.1",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            26,
            34
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 30,
        "data": {
          "id": "safe-buffer",
          "version": "5.2.1",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            26,
            31,
            20
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 31,
        "data": {
          "id": "string_decoder",
          "version": "1.1.1",
          "path": "node_modules",
          "meta": [
            {
              "range": "~5.1.0",
              "type": "norm",
              "depthEnd": false,
              "optional": false,
              "invalid": true
            }
          ],
          "requiring": [
            30
          ],
          "requiredBy": [
            26
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 32,
        "data": {
          "id": "util-deprecate",
          "version": "1.0.2",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            26
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      },
      {
        "dataIndex": 33,
        "data": {
          "id": "stream-shift",
          "version": "1.0.1",
          "path": "node_modules",
          "meta": [],
          "requiring": [],
          "requiredBy": [
            21
          ]
        },
        "vx": 0,
        "vy": 0,
        "x": 0,
        "y": 0,
        "showNode": false,
        "showRequiring": false
      }
    ]
    readme(d,eee)
    // 首次点击，添加定时器，350ms后进行toggle
    d._clickid = setTimeout(() => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      
      updateChart(d)
      d._clickid = null;
    }, 350);
  }
}

export default D3view
