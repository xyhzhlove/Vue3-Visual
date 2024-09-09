<template>
  <div className="backgournd-grid-app">
    <div className="app-content" ref="graphContainer" />
  </div>
</template>

<script setup lang="ts">
import { useGraph } from "@zh-ui/hooks"
import { Graph } from "@antv/x6"
import { onMounted, ref } from "vue"
import { graphOptions, customNodeOptions } from "./config"
const graphContainer = ref(null)
let graph: Graph
onMounted(() => {
  graph = useGraph(graphContainer, graphOptions, customNodeOptions, undefined)

  const source = graph.addNode({
    shape: "custom-node", // 可以直接使用上面注册过的 shape
    x: 40,
    y: 40,
    label: "hello",
  })

  const target = graph.addNode({
    shape: "custom-node",
    x: 160,
    y: 180,
    label: "world",
  })

  graph.addEdge({
    source,
    target,
    attrs: {
      line: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
      },
    },
  })

  graph.centerContent()
})
</script>

<style lang="less" scoped>
.backgournd-grid-app {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    box-shadow:
      0 12px 5px -10px rgb(0 0 0 / 10%),
      0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
</style>
