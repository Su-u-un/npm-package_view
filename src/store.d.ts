import { UnwrapNestedRefs } from "vue"

export const store: UnwrapNestedRefs<({
    data: any,
    readme: string | undefined,
    color: string
})>