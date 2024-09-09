import type { App, Plugin } from "vue"
export type SFCWithInstall<T> = T & Plugin;
export const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    //注册组件
    // 在这个例子中，(comp as any).name 表示您暂时将 comp 视为 any 类型，以便访问其 name 属性。这通常是因为 name 属性可能没有在 T 类型中明确声明。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.component((comp as any).name, comp as any)
  }
  return comp as SFCWithInstall<T>
}
