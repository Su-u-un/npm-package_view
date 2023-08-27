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
    update(){
        
    }

   

}