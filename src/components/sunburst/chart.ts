import * as d3 from 'd3'
import {DiagramNode,DirectedDiagram} from "./types"
import { Hierarchy } from './chartNode';
import { readInfo } from '@/utils';

export type ChartOption = {
    duration:number;
    showDesc:boolean;
}
type HierarchyPointNode = d3.HierarchyPointNode<Hierarchy> & {
    x0:number;
    y0:number;
    x1:number;
    y1:number;
    children: HierarchyPointNode[] | undefined;
};

let { innerWidth: width, innerHeight: height } = window;
const radius = width / 8;

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
    sunData!:d3.HierarchyRectangularNode<unknown>
    panel!: d3.Selection<SVGGElement, any, any, any>;
    label!:d3.Selection<SVGGElement | SVGTextElement, any, any, any>;
    parent!:d3.Selection<SVGGElement | SVGTextElement, any, any, any>;
    arc:d3.Arc<any, d3.DefaultArcObject> = d3.arc()
    item!:any;
    clickItem:any
    color:d3.ScaleOrdinal<string, string> = d3.scaleOrdinal([''],[''])
    svg!:d3.Selection<SVGSVGElement, unknown, HTMLElement, any>

    init(){
        // 数据处理
        this.initData();
        // 创建渲染视图
        this.template()
    }
    initData(){
        const {data} = this
        
        const hierarchy = Hierarchy.createHierarchy(data);
        this.root = d3.hierarchy(hierarchy)
        
        this.root.sum(d => d.value)
        
        this.color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, this.root.children!.length + 1));

        readInfo(this.root.data.nodes[0].dir!)
        // 定义旭日图层级
        const sunMap = d3.partition().size([2 * Math.PI, this.root.height + 1])
        this.sunData = sunMap(this.root)
        this.sunData.each((d:any) => d.current = d);

        // 定义arc函数
        this.arc = d3.arc()
            .startAngle((d:any) => d.x0)
            .endAngle((d:any) => d.x1)
            .padAngle((d:any) => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius((d:any) => d.y0 * radius)
            .outerRadius((d:any) => Math.max(d.y0 * radius, d.y1 * radius - 1))
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

        // 自适应窗口大小
        const w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName("body")[0];

        function updateWindow() {
            width = w.innerWidth || e.clientWidth || g.clientWidth;
            height = w.innerHeight || e.clientHeight || g.clientHeight;

            svg.attr("width", width).attr("height", height - 63);
        }
        d3.select(window).on("resize.updatesvg", updateWindow);


        this.svg = svg
        // 创建视图容器
        ct.panel = svg.append('g')
        // 所有的项
        ct.item = ct.panel.selectAll("path").data(this.sunData.descendants().slice(1))
            .join("path")
            .attr("fill", (d:any) => { while (d.depth > 1) d = d.parent; return ct.color(d.data.nodes[0].id); })
            .attr("fill-opacity", (d:any) => ct.arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", (d:any) => ct.arcVisible(d.current) ? "auto" : "none")
            .attr("d", (d:any) => ct.arc(d.current))
            .on("mouseover", function (this:any,e) {
                d3.select(this).style("stroke", "yellow");
                ct.mouseOver(e)
            })
            .on("mouseout", function (this) {
                d3.select(".chartTooltip").classed("hidden", true);
                d3.select(this).style("stroke", "");
            })
            // 添加点击事件
            .style("cursor", "pointer")
            .on("click", (e)=>ct.click(e))


            let a = ct.panel.append('g').join('text')
        // 每一项的标题
        ct.label = ct.panel.append('g')
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none").selectAll("text").data(this.sunData.descendants().slice(1))
            .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", (d:any) => +ct.labelVisible(d.current))
            .attr("transform", (d:any) => ct.labelTransform(d.current))
            .text((d:any) => d.data.nodes[0].id)
        
        // 中间返回父级的部分
        ct.parent = ct.panel.append('circle')
            .datum(ct.sunData)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on('click',(e)=>{ct.click(e)})
            
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

        const div = d3
            .select(ct.id)
            .append("div")
            .attr("class", "tree chartTooltip hidden");
    }
    mouseOver(d: HierarchyPointNode) {
        const { showDesc } = this.options;

        if (showDesc) {
            // 从d3.event获取鼠标的位置
            let transform = d3.event;
            let yPosition = transform.offsetY - 20;
            let xPosition = transform.offsetX + 20;
            // 将浮层位置设置为鼠标位置
            let chartTooltip = d3
                .select(".chartTooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");
            let inner = chartTooltip.selectAll("p").data(d.data.nodes);

            // 处理节点数据
            let depth: string = " ";
            if (d.depth === 0) depth = "主目录";
            else if (d.depth === 1) depth = "主依赖";
            // 更新浮层内容
            let list: [
                string,
                string,
                (string | ((n: DiagramNode) => string))?
            ][] = [
                ["id", "", "**$**"],
                ["version", "版本"],
                ["dir", "目录"],
                [
                    "requiring",
                    "依赖",
                    (n) => "**" + n.requiring.length + "**个包",
                ],
                [
                    "requiredBy",
                    "应用",
                    (n) => "**" + n.requiredBy.length + "**个包",
                ],
                ["depth", "", depth],
            ];
            inner.join("p").html(
                (n, i, a) =>
                    list
                        .map((e) =>
                            d3
                                .create("p")
                                .attr("class", e[0])
                                .text(
                                    (e[1] ? e[1] + "：" : "") +
                                        (e[2]
                                            ? typeof e[2] === "function"
                                                ? e[2](n)
                                                : e[2]
                                            : "$")
                                )
                                .node()
                                ?.innerHTML.replace(
                                    /\*\*(.*)\*\*/,
                                    "<strong>$1</strong>"
                                )
                                .replace("$", n[e[0]])
                        )
                        .join("<br>") + (i < a.length - 1 ? '<hr class="tree tooltip-hr">' : "")
            );

            // 移除浮层hidden样式，展示浮层
            chartTooltip.classed("hidden", false);
        }
    }

    click(p:HierarchyPointNode){
        // 显示readme
        const first = p.data.nodes[0];
        
        if (first.dir) {
            if(p.depth===0) readInfo(first.dir)
            else readInfo(first.dir, first.id);
        }
        this.clickItem = p;

        // 通过判断是否存在后代进行下一步
        if(p.children){
        const ct = this
        const {duration} = this.options
        this.parent.datum(p.parent||this.sunData)

        this.sunData.each((d:any) => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          });

        let t = this.svg.transition().duration(duration)
        
        this.item.transition(t)
          .tween("data", d => {
            console.log(d);
            
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(this:any,d:any) {
          return +this.getAttribute("fill-opacity") || ct.arcVisible(d.target);
        })
          .attr("fill-opacity", d => ct.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", d => ct.arcVisible(d.target) ? "auto" : "none") 
    
          .attrTween("d", d => () => ct.arc(d.current));

        this.label.filter(function(this:any,d:any) {
            return +this.getAttribute("fill-opacity") || ct.labelVisible(d.target);
          })
            .transition(t)
            .attr("fill-opacity", d => +ct.labelVisible(d.target))
            .attrTween("transform", d => () => ct.labelTransform(d.current));
        }
    }

    arcVisible(d:HierarchyPointNode) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
      
    labelVisible(d:HierarchyPointNode) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }
      
    labelTransform(d:HierarchyPointNode) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

}