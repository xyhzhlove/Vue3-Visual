import { Graph, Options, Node, Edge } from "@antv/x6"
import { type Ref } from "vue"

// Options.Manual表示 Options命名空间中的Manual类型
// Omit 排除Options.Definition container字段的类型
// Partial 将 Partial 类型会把输入类型的所有属性都变成可选属性

export const useGraph = (
  container: Ref,
  options: Omit<Partial<Options.Manual>, "container">,
  customNodeOptions:
    | Array<{
        entities: {
          [name: string]:
            | Node.Definition
            | (Node.Config & {
                inherit?: string | Node.Definition | undefined;
              });
        };
        force?: boolean | undefined;
      }>
    | undefined,
  customEdgeOptions:
    | Array<{
        entities: {
          [name: string]:
            | Edge.Definition
            | (Edge.Config & {
                inherit?: string | Edge.Definition | undefined;
              });
        };
        force?: boolean | undefined;
      }>
    | undefined
): Graph => {
  // 自定义节点
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  customNodeOptions &&
    customNodeOptions.forEach((item) => {
      Graph.registerNode(item.entities, item.force)
    })
  // 自定义边
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  customEdgeOptions &&
    customEdgeOptions.forEach((item) => {
      Graph.registerEdge(item.entities, item.force)
    })

  // 自定义连接桩

  // 自定义连接桩

  // 自定义事件

  // 初始graph实例
  const graphInstance = new Graph({
    container: container.value,
    ...options,
  })

  return graphInstance
}
