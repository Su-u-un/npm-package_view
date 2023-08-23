import { Hierarchy } from "./types";

export function collapse(d: Hierarchy) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}