import { Options, Node } from "@antv/x6"
export const graphOptions: Omit<Partial<Options.Manual>, "container"> = {
  background: {
    color: "#F2F7FA",
  },
  grid: {
    args: [
      {
        color: "#eee", // 主网格线颜色
        thickness: 1, // 主网格线宽度
      },
      {
        color: "#ddd", // 次网格线颜色
        factor: 4,
        thickness: 1, // 次网格线宽度 // 主次网格线间隔
      },
    ],
    type: "doubleMesh",
    visible: true,
  },
}

export const customNodeOptions:
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
  | undefined = [
    {
      entities: {
        "custom-node": {
          attrs: {
            body: {
              stroke: "#8f8f8f",
              strokeWidth: 1,
              fill: "#fff",
              rx: 6,
              ry: 6,
            },
            img: {
              "xlink:href":
              "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
              "width": 16,
              "height": 16,
              "x": 12,
              "y": 12,
            },
          },

          height: 40,
          inherit: "rect", // 继承于 rect 节点
          markup: [
            {
              tagName: "rect", // 标签名称
              selector: "body", // 选择器
            },
            {
              tagName: "image",
              selector: "img",
            },
            {
              tagName: "text",
              selector: "label",
            },
          ],
          width: 100,
        },
      },
      force: true,
    },
  ]
