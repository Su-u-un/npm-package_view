import * as d3 from 'd3'
import {DirectedDiagram} from "./types"
import { Hierarchy } from './chartNode';

export type ChartOption = {
    duration:number;
    showDesc:boolean;
}

type HierarchyNode = d3.HierarchyNode<Hierarchy> & {
    x0: number;
    y0: number;
    _children?: HierarchyNode[] | undefined;
};

let { innerWidth: width, innerHeight: height } = window;
const radius = width / 6;
// console.log(typeof radius);


export default class Chart{
    constructor(
        public id : string,
        public data : DirectedDiagram,
        initOptions : Partial<ChartOption> = {}
    ){
        this.options = {
            duration:800, // 节点加载速度
            showDesc:true, // 显示依赖包简要信息
            ...initOptions
        }
        this.init();
    }
    options:ChartOption
    root!: d3.HierarchyNode<Hierarchy>
    sunData:any
    panel: d3.Selection<SVGGElement, any, any, any> = d3.select('body');
    items: d3.HierarchyPointNode<unknown>[] = [];
    label:any;
    parent:any;
    arc:any;
    path:any;
    clickItem:any
    color:any
    svg:any


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
        
        const hierarchy = Hierarchy.createHierarchy(data);
        this.root = d3.hierarchy(hierarchy)
        // this.root = Object.assign(d3.hierarchy(hierarchy),{x0:0,y0:0})
        
        this.root.sum(d => d.value)
        this.color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, this.root.children.length + 1));


        this.clickItem = this.root
        // 定义旭日图层级
        const sunMap = d3.partition().size([2 * Math.PI, this.root.height + 1])
        this.sunData = sunMap(this.root)
        this.sunData.each(d => d.current = d);

        
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
            .attr("style", "max-width: 100%; max-height: 100%;")
            .attr('id','svg') // 添加id

        this.svg = svg
        // 创建视图
        ct.panel = svg.append('g')
        // 文字
        ct.label = svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
        // 中间的返回父级圈圈
        ct.parent = svg.append('g')
            .datum(this.sunData)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on('click',click)
        
        // 创建zoom
        const zoom = d3
            .zoom()
            // 设置缩放区域为0.1-100倍
            .scaleExtent([0.1, 100])
            .on("zoom", () => {
                // 子group元素将响应zoom事件，并更新transform状态
                const { x, y, k } = d3.event.transform;
                ct.panel.attr("transform", `translate(${x}, ${y}) scale(${k})`);
                ct.label.attr("transform", `translate(${x}, ${y}) scale(${k})`);
            });

        // 绑定zoom事件，同时释放zoom双击事件
        svg.call(zoom).on("dblclick.zoom", () => {});

    }
    // 处理更新的数据
    update(){
        this.path = this.sunData.descendants().slice(1)
        
        this.updateTest()
        this.updateLabel()
    }
    // 更新图例
    updateTest(){
        const path = this.panel.selectAll('path').data(this.path)

        const ct = this
        const root = this.clickItem
        
        // 对图例的进行处理
        path.join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return this.color(d.data.nodes[0].id); })
            .attr("fill-opacity", d => ct.arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => ct.arcVisible(d.current) ? "auto" : "none")
            .attr("d", d => ct.arc(d.current))
            
        path.filter(d => d.children )
            .style("cursor", "pointer")
            .on("click", click);

        const format = d3.format(",d");
        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.nodes[0].id).reverse().join("/")}\n${format(d.value)}`);
            
        

        
            
    }

    updateLabel(){
        const label = this.label.selectAll("text").data(this.path)
        const ct = this

        label.join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +ct.labelVisible(d.current))
            .attr("transform", d => ct.labelTransform(d.current))
            .text(d => d.data.nodes[0].id);
    }

    clicked(p){
        console.log("点了item");
        
        const ct = this
        this.parent.datum(p.parent)

        this.sunData.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          });


        this.panel.transition(this.svg.transition().duration(750))
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || ct.arcVisible(d.target);
        })
          .attr("fill-opacity", d => ct.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", d => ct.arcVisible(d.target) ? "auto" : "none") 
    
          .attrTween("d", d => () => ct.arc(d.current));

        this.label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || ct.labelVisible(d.target);
          }).transition(t)
            .attr("fill-opacity", d => +ct.labelVisible(d.target))
            .attrTween("transform", d => () => ct.labelTransform(d.current));
    }
    clickCenter(event,p){
        console.log("点了nidie");

        const ct = this
        this.parent.datum(this.sunData)
        this.sunData.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          });


        this.panel.transition(this.svg.transition().duration(750))
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || ct.arcVisible(d.target);
        })
          .attr("fill-opacity", d => ct.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", d => ct.arcVisible(d.target) ? "auto" : "none") 
    
          .attrTween("d", d => () => ct.arc(d.current));

        this.label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || ct.labelVisible(d.target);
          }).transition(t)
            .attr("fill-opacity", d => +ct.labelVisible(d.target))
            .attrTween("transform", d => () => ct.labelTransform(d.current));
    }

    arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }
      
    labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }
      
    labelTransform(d) {
        // console.log(d);
        
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      }

}
function click(){
    console.log("www");
    
}