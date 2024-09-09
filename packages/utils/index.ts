// 导出install文件中导出的所有内容
// // 假设 "./common/install" 中有如下导出
// export const someFunction = () => {};
// export default someDefaultExport;

//  则 export * from "./common/install" 等价于
// export { someFunction } from "./common/install";
// export { someDefaultExport as default } from "./common/install";

export * from "./common/install"
