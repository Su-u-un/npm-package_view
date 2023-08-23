import * as d3 from 'd3'
import {DirectedDiagram} from "./types"
import {Hierarchy } from './chartNode';


export type ChartOption = {
    duration:number;
    showDesc:boolean;
}

let i = 0

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
    clickNode!:d3.HierarchyPointNode<unknown>
    nodes: d3.HierarchyPointNode<unknown>[] = [];
    links: d3.HierarchyPointNode<unknown>[] = [];
    treeMap!:d3.TreeLayout<unknown>
    panel: d3.Selection<SVGGElement, any, any, any> = d3.select('body');

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
        console.log(hierarchy);
        
        this.root = Object.assign(d3.hierarchy(hierarchy),{x0:0,y0:0})
        // 定义Tree层级，并设置宽高
        this.treeMap = d3.tree().nodeSize([50, 50]);
        
        this.root.children!.forEach(collapse)
        this.clickNode = this.root

        // 设置初始展开树
        function collapse(d: any) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }
    }
    template(){
        const { id } = this;
        const ct = this
        let { innerWidth: width, innerHeight: height } = window;
        
        /*初始化宽高*/
        const svg = d3
            .select(id) // 获取dom
            .append('svg') // 在dom内加入svg标签
            .attr("width", width)
            .attr("height", height-63)
            .attr("viewBox", [-width / 2, -height / 2, width, height-63]) // 设置视窗大小
            .attr("style", "max-width: 100%; max-height: 100%;");
            // .attr('id','svg') // 添加id

        // 自适应窗口大小
        const w = window,
            d = document,
            e = d.documentElement,
            gg = d.getElementsByTagName('body')[0];

        function updateWindow(){
            width = w.innerWidth || e.clientWidth || gg.clientWidth;
            height = w.innerHeight|| e.clientHeight|| gg.clientHeight;

            svg.attr("width", width).attr("height", height-63);
        }
        d3.select(window).on('resize.updatesvg', updateWindow);

        // 创建视图
        ct.panel = svg
            .append('g')

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

        // 创建信息浮层
        const div = d3
        .select(ct.id)
        .append('div')
        .attr('class','chartTooltip hidden')

        div.append('p').attr('class','name')
        div.append('p').attr('class','version')
        div.append('p').attr('class','dir')
        div.append('p').attr('class','requiring')
        div.append('p').attr('class','requiredBy')
        div.append('p').attr('class','depth')
    }
    update(){
        // 设置节点的x、y位置信息
        let treeData= this.treeMap(this.root);
        // 计算新的Tree层级
        this.nodes = treeData.descendants()
        this.links = treeData.descendants().slice(1);
        
        // 设置每个同级节点间的y间距为100
        this.nodes.forEach((d: any)=>{
            d.y = d.depth * 100;
        });

        // 为动画过渡保存旧的位置
        this.updateNodes()
        this.updateLinks()
        this.nodes.forEach((d:any) =>{
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    updateNodes(){
        const node = this.panel.selectAll("g.node").data(this.nodes, (d: any) => d.id || (d.id = ++i))
        const root = this.clickNode
        const ct = this
        
        // enter得到多于当前页面element的数据
        // 获取enter的数据，对这些数据进行处理
        let nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("id", (d: any) => { return d.id })
            // 默认位置为当前父节点的位置
            .attr("transform", function () {
                return "translate(" + root.y0 + "," + root.x0 + ")";
            })
            // 给每个新加的节点绑定click事件
            .on("click",function(e:any){ct.click(e)})
            // 设置鼠标放置显示的浮层
            .on("mouseover", function(e: any){ct.mouseOver(e)})
            // 鼠标离开隐藏浮层
            .on("mouseout", () => {
                // 添加浮层hidden样式，隐藏浮层
                d3.select(".chartTooltip").classed("hidden", true);
            })

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
            .duration(this.options.duration)
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
            .duration(this.options.duration)
            .attr("transform", function (d:any) {
                return "translate(" + root.y + "," + root.x + ")";
            })
            // 移除元素
            .remove();

        // exit集中节点的cycle元素尺寸变为0
        nodeExit.select("circle").attr("r", 1e-6);

        // exit集中节点的text元素可见度降为0
        nodeExit.select("text").style("fill-opacity", 1e-6);
    }


    updateLinks(){
        const link = this.panel.selectAll("path.link").data(this.links, (d: any) => d.id)
        const root = this.clickNode

        // 添加enter操作，添加类名为link的path元素
        let linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            // 添加id
            .attr("id", (d: any) => {
                return "textPath" + d.id;
            })
            .on("mouseover",  function(this){
                d3.select(this).style("stroke", "orange");
            })
            .on("mouseout",  function(this){
                d3.select(this).style("stroke", '#CCC');
            })
            .on("click", (d: any) => {
                alert(d.parent.data.id + ' -> ' + d.data.id);
        })
        // 默认位置为当前父节点的位置
        .attr("d", function () {
            let o = {
                x: root.x0,
                y: root.y0
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
            .duration(this.options.duration)
            .attr("d", function (d: any) {
                return diagonalReverse(d, d.parent);
            });
        // 获取exit集
        let linkExit = link
            .exit()
            // 设置过渡动画
            .transition()
            .duration(this.options.duration)
            .attr("d", function (d:any) {
                let o = {
                    x: root.x,
                    y: root.y
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

    click(d: any) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.clickNode = d
        this.update()
        d._clickid = null;
    }

    mouseOver(d:any){
        const {showDesc} = this.options

        if(showDesc){
            // 从d3.event获取鼠标的位置
            let transform = d3.event;
            let yPosition = transform.offsetY - 20;
            let xPosition = transform.offsetX + 20;
            // 将浮层位置设置为鼠标位置
            let chartTooltip = d3
                .select(".chartTooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");

            // 处理节点数据
            let depth:string = ""
            if(d.depth === 0) depth = "主目录"
            else if(d.depth === 1) depth = "主依赖"
            
            // 更新浮层内容
            chartTooltip.select(".name").text('名称：'+d.data.id);
            chartTooltip.select(".version").text('版本：'+d.data.version);
            chartTooltip.select(".dir").text('目录：'+d.data.dir);
            chartTooltip.select(".requiring").text('依赖：'+d.data.requiring.length+"个包");
            chartTooltip.select(".requiredBy").text('应用：'+d.data.requiredBy.length+"个包");
            chartTooltip.select(".depth").text(depth);

            // 移除浮层hidden样式，展示浮层
            chartTooltip.classed("hidden", false);
        }
    }
}
