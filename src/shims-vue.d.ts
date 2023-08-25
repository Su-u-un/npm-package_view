import VueRouter from "vue-router";
import { Route, RouterView } from "vue-router";
import Vue from "vue";

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const vueComponent: DefineComponent<{}, {}, any>
    export default vueComponent;
}