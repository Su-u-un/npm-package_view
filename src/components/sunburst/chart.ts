import * as d3 from 'd3'
import {DirectedDiagram} from "./types"
import {Hierarchy } from './chartNode';

export type ChartOption = {
    duration:number;
    showDesc:boolean;
}

let { innerWidth: width, innerHeight: height } = window;
const radius = width / 6;

export default class Chart{
    constructor(
        public id:string,
        public data:DirectedDiagram,
        initOptions: Partial<ChartOption> = {}
    ){
        this.options = {
            duration:800, // 节点加载速度
            showDesc:true, // 显示依赖包简要信息
            ...initOptions
        }
        this.init();
    }
    options:ChartOption
    root!:d3.HierarchyNode<Hierarchy>& {
        x0: number;
        y0: number;
    }
    sunMap!:d3.PartitionLayout<unknown>
    panel: d3.Selection<SVGGElement, any, any, any> = d3.select('body');
    items: d3.HierarchyPointNode<unknown>[] = [];
    label:any;
    parent:any;
    arc:any


    init(){
        // 将数据处理成层次图数据
        this.initData();
        // 新建渲染元素
        this.template()
        // 首次渲染(更新)视图
        this.update()
    }
    initData(){
        const {data} = this
        const hierarchy = new Hierarchy(data)

        this.root = Object.assign(d3.hierarchy(hierarchy),{x0:0,y0:0})
        this.root.sum(d => d.value)
        // 定义旭日图层级
        this.sunMap = d3.partition().size([2 * Math.PI, hierarchy.height + 1])
        // 定义arc函数
        this.arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
        
    }
    template(){
        const { id } = this;
        const ct = this
        
        /*初始化宽高*/
        const svg = d3
            .select(id) // 获取dom
            .append('svg') // 在dom内加入svg标签
            .attr("width", width)
            .attr("height", height-63)
            .attr("viewBox", [-width / 2, -height / 2, width, height-63]) // 设置视窗大小
            .attr("style", "max-width: 100%; max-height: 100%;");
            // .attr('id','svg') // 添加id

        // 创建视图
        ct.panel = svg.append('g')
        
        ct.label = svg.append("g")
        
        // 创建zoom
        const zoom = d3
            .zoom()
            // 设置缩放区域为0.1-100倍
            .scaleExtent([0.1, 100])
            .on("zoom", () => {
                // 子group元素将响应zoom事件，并更新transform状态
                const { x, y, k } = d3.event.transform;
                ct.panel.attr("transform", `translate(${x}, ${y}) scale(${k})`);
            });

        // 绑定zoom事件，同时释放zoom双击事件
        svg.call(zoom).on("dblclick.zoom", () => {});

    }
    update(datum){
        const ct = this
        // 计算新的Sun层级
        let sunData = this.sunMap(this.root)
        sunData.each(d => d.current = d);
        
        // 获取新数据
        this.items = sunData.descendants().slice(1);
        // 返回按钮更新
        
        // 中心空白处，点击返回上级
        ct.parent = svg.append("circle")
            .datum(datum)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", function(e,p){ct.clicked(e,p)});

        
        this.updateItems()
    }

    updateItems(){
        const ct = this
        const item = this.panel.selectAll("path").data(this.items)
            .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
            .attr("d", d => arc(d.current))
            .filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        // 每一份的名称
        const text = this.label.selectAll("text").data(this.items)
            .join("text")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);

        

    }

    clicked(event, p) {
        parent.datum(p.parent || sunData);

        this.sunData.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        this.items.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 

            .attrTween("d", d => () => arc(d.current));

        this.label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

}

function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }
  
  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }
  
  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

