import { ExtractPropTypes } from 'vue'
 
export const ButtonType = ['default', 'primary', 'success', 'warning', 'danger']
export const ButtonSize = ['large', 'normal', 'small', 'mini'];
export const buttonProps = {
  type: {
    type: String,
    values: ButtonType
  },
  size: {
    type: String,
    values: ButtonSize
  }
}
 
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
// ExtractPropTypes 从一个描述组件属性的对象中提取出属性的类型。
// 这个函数返回一个类型，该类型可以用于确保组件属性的类型安全。
// 使用 ExtractPropTypes 可以提高 TypeScript 的类型推断能力，从而提高代码质量和可维护性

// 从{
//   type: {
//     type: String,
//     values: ButtonType
//   },
//   size: {
//     type: String,
//     values: ButtonSize
//   }
// }对象中提取出
// type ButtonProps = {} & {
//     type?: string | undefined;
//     size?: string | undefined;
// }
// 类型