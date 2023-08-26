export type DependencyType = 'norm' | 'dev' | 'peer' | 'optional';

// 顶点属性
export type DiagramNode = {
    [x: string]: any;
    id: string;
    version: string;
    dir: string | null;
    meta: LinkMeta[];
    requiring: number[];
    requiredBy: number[];
};

// 边属性
export type LinkMeta = {
    type: DependencyType; // 【边属性】该依赖的类型
    range: string; // 【边属性】该依赖需要的版本范围
    optional: boolean; // 【边属性】该依赖是否必须
    invalid: boolean; // 【边属性】该依赖关系是否版本非法
    depthEnd: boolean; // 【边属性】该依赖关系是否到达了递归的终点（当递归深度有限时）
}

export type DirectedDiagram = 
    // 表示依赖关系的有向图结构
    DiagramNode[];