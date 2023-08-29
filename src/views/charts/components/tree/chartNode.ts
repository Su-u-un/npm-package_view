import { SCComponent, getScc } from "@/utils/diagram";
import { DiagramNode, DirectedDiagram } from "./types";

export class Hierarchy {
    static createHierarchy(data: DirectedDiagram): Hierarchy {
        const protoComps = getScc(
            0,
            data,
            (i) => data[i].requiring,
            (i) => data[i].requiredBy
        );
        const rootCompIndex = protoComps.findIndex((c) => c.nodes.includes(0));
        const root = new Hierarchy(data, protoComps[rootCompIndex].nodes);
        root.children = Hierarchy.trans(data, protoComps, rootCompIndex);
        return root;
    }

    private constructor(data: DirectedDiagram, dataIndices: number[]) {
        this.nodes = dataIndices.map((i) => data[i]);
        this.value = Math.floor(Math.random() * 100);
    }
    nodes: DiagramNode[];
    children?: Hierarchy[];
    value: number;

    private static trans(
        data: DirectedDiagram,
        comps: SCComponent[],
        i: number,
        hash = new Map<number, Hierarchy[]>()
    ): Hierarchy[] {
        if (hash.has(i)) {
            return hash.get(i)!;
        }
        const root = comps[i];
        const children = root.outer.outs
            .filter((ci) => ci !== i)
            .map<Hierarchy>((ci) => {
                const child = new Hierarchy(data, comps[ci].nodes);
                child.children = Hierarchy.trans(data, comps, ci, hash);
                return child;
            });
        hash.set(i, children);
        return children;
    }
}
