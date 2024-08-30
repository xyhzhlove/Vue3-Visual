---
author: Yonghui Xu
data: 2024.8.30
description: 一个前端包的尝试
keywords:
 - antvx6
 - monorepo
 - packages
--- 

# 笔记
## 新建.npmrc
配置  shamefully-hoist = true
如果某些工具仅在根目录的node_modules时才有效，可以将其设置为true来提升那些不在根目录的node_modules，就是将你安装的依赖包的依赖包的依赖包的...都放到同一级别（扁平化）。说白了就是不设置为true有些包就有可能会出问题。

## 新建pnpm-workspace.yaml
为了我们各个项目之间能够互相引用，我们要新建一个pnpm-workspace.yaml文件将我们的包关联起来
```yaml
packages:
    - 'packages/**'
    - 'examples'
```

packages/**: 这个条目表示所有的子包都位于 packages 目录下，并且可以是任意深度的子目录。这意味着 packages 目录下的所有子目录都将被视为单独的包。
examples: 这个条目表示 examples 目录下的内容也被视为一个或多个包。如果 examples 目录包含一个或多个 package.json(作为包的标识) 文件，那么每个这样的目录都将被视为一个独立的包。

这样就能将我们项目下的packages目录和examples目录关联起来了，当然如果你想关联更多目录你只需要往里面添加即可。根据上面的目录结构需要在根目录下新packages和examples文件夹
packages文件夹存放我们开发的包，examples用来调试我们的组件
examples文件夹就是接下来我们要使用vite搭建一个基本的Vue3脚手架项目的地方

## 安装依赖
我们开发环境中的依赖一般全部安装在整个项目根目录下，方便下面我们每个包都可以引用,所以在安装的时候需要加个 -w
-w 是workspace的意思，表示将包安装至指定空间(这里指pnpm-workspace.yaml所在的空间)
```
pnpm i vue typescript less -D -w
```

###  配置tsconfig.json
运行
```
npx tsc --init
```


## 手动搭建一个基于vite的vue3项目(examples目录中的操作)
### 初始化仓库
进入examples文件夹，执行
```
pnpm init
```

### 安装vite和@vitejs/plugin-vue
@vitejs/plugin-vue用来支持.vue文件的转译
```
pnpm install vite @vitejs/plugin-vue -D -w
```
这里安装的插件都放在根目录下

### 配置vite.config.ts
新建vite.config.ts
```ts 
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
 
export default defineConfig({
    plugins:[vue()]
})
```

###  新建html文件
@vitejs/plugin-vue 会默认加载examples下的index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="main.ts" type="module"></script>
</body>
</html>
```
注意： vite 是基于esmodule的 所以type="module"

### 新建app.vue模板
```vue
<template>
  <Button />
</template>

<script setup>
import {Button} from "zh-ui"
</script>

<style lang="less" scoped></style>
```

### 新建main.ts
```ts
import {createApp} from 'vue'
import App from './app.vue'
 
const app = createApp(App)
 
app.mount('#app')
```

此时会发现编译器会提示个错误：找不到模块“./app.vue”或其相应的类型声明
因为直接引入.vue文件 TS会找不到对应的类型声明；所以需要新建typings（命名没有明确规定，TS会自动寻找.d.ts文件）文件夹来专门放这些声明文件。
typings/vue-shim.d.ts
TypeScriptTS默认支持ES 模块。如果你要导入.vue文件就要declare module把他们声明出来。

### 配置脚本启动项目
最后在package.json文件中配置scripts脚本
```json
"scripts": {
    "dev": "vite"
  },
```

## packages目录的操作
### utils包
一般packages要有utils包来存放我们公共方法，工具函数等
既然它是一个包，所以我们新建utils目录后就需要初始化它，让它变成一个包；
终端进入utils文件夹执行：pnpm init 然后会生成一个package.json文件；
这里需要改一下包名
这里将name改成@zh-ui/utils表示这个utils包是属于zh-ui这个组织下的。
所以记住发布之前要登录npm新建一个组织；例如zh-ui

### 组件库包(这里命名为zh-ui)
components是我们用来存放各种UI组件的包
新建components文件夹并执行 pnpm init 生成package.json
将name修改为 zh-ui

### esno
由于组件库是基于ts的，所以需要安装esno来执行ts文件便于测试组件之间的引入情况
控制台输入esno xxx.ts即可执行ts文件
注意:全局安装使用npm
```
npm i esno -g 
```

### 包之间本地调试
进入components文件夹执行
```
pnpm install @zh-ui/utils -w
```
你会发现pnpm会自动创建个软链接直接指向我们的utils包；此时components下的package.json：
```json
{
  "name": "zh-ui",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@zh-ui/utils": "workspace:^"
  }
}
```

你会发现它的依赖@zh-ui/utils对应的版本为：workspace:^；因为pnpm是由workspace管理的，所以有一个前缀workspace可以指向utils下的工作空间从而方便本地调试各个包直接的关联引用。


## 开发组件
试着开发一个Button组件
在components文件夹下新建src,同时在src下新建Button目录,并在src目录下的index.ts中导出
src目录下的index.ts如下
```ts
import Button from './Button/Button.vue'
export {
    Button,
}
```

因为Button组件是需要接收很多属性的，如type、size等等，所以我们要新建个types.ts文件来规范这些属性
在Button目录下新建types.ts
```ts
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
```
很多时候我们在vue中使用一个组件会用的app.use 将组件挂载到全局。要使用app.use函数的话我们需要让我们的每个组件都提供一个install方法，app.use()的时候就会调用这个方法;
我们将Button/index.ts调整为
```ts
interface Plugin {
  install: (app: App, ...options: any[]) => void;
}
```
```ts
import Button from './Button.vue'
import type {App,Plugin} from "vue"
type SFCWithInstall<T> = T&Plugin
const withInstall = <T>(comp:T) => {
    (comp as SFCWithInstall<T>).install = (app:App)=>{
        //注册组件
        // 在这个例子中，(comp as any).name 表示您暂时将 comp 视为 any 类型，以便访问其 name 属性。这通常是因为 name 属性可能没有在 T 类型中明确声明。
        app.component((comp as any).name,comp as any)
    }
    return comp as SFCWithInstall<T>
}
const Button = withInstall(Button)
export default Button
```
此时我们就可以使用app.use来挂载我们的组件啦
其实withInstall方法可以做个公共方法放到工具库里
因为后续每个组件都会用到，这里等后面开发组件的时候再调整
到这里组件开发的基本配置已经完成
最后我们对我们的组件库以及工具库进行打包
打包之前如果要发公共包的话记得将我们的各个包的协议改为MIT开源协议
```
"license": "MIT",
```
### 使用组件
Vue3项目使用Button
所以这里我们直接在examples执行：
```
pnpm i zh-ui -w
```
此时你就会发现packages.json的依赖多了个
``` 
"zh-ui": "workspace:^"
```
这时候我们就能直接在我们的测试项目下引入我们本地的components组件库了，启动我们的测试项目，来到我们的 examples/app.vue 直接引入Button

```vue
<template>
  <Button />
</template>

<script setup>
import {Button} from "zh-ui"
</script>
<style lang="less" scoped></style>
```

## vite 打包
### 配置文件
打包们这里选择vite，它有一个库模式专门为我们来打包这种库组件的。
前面已经安装过vite了，
所以这里直接在components下直接新建vite.config.ts(配置参数文件中已经注释):
```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"
export default defineConfig(
    {
        build: {
            target: 'modules',
            //打包文件目录
            outDir: "es",
            //压缩
            minify: false,
            //css分离
            //cssCodeSplit: true,
            rollupOptions: {
                //忽略打包vue文件
                external: ['vue'],
                input: ['src/index.ts'],
                output: [
                    {
                        format: 'es',
                        //不用打包成.es.js,这里我们想把它打包成.js
                        entryFileNames: '[name].js',
                        //让打包目录和我们目录对应
                        preserveModules: true,
                        //配置打包根目录
                        dir: './zh-ui/es',
                        // 打包后将不会出现src目录，只出现src目录下的内容
                        preserveModulesRoot: 'src'
                    },
                    {
                        format: 'cjs',
                        entryFileNames: '[name].js',
                        //保持模块划分，输出文件的目录结构将与源码目录结构一致。
                        preserveModules: true,
                        //配置打包根目录
                        dir: './zh-ui/lib',
                        preserveModulesRoot: 'src'
                    }
                ]
            },
            lib: {
                
                entry: './index.ts',
                formats: ['es', 'cjs']
            }
        },
        plugins: [
            vue()
        ]
    }
)
```

这里我们选择打包cjs(CommonJS)和esm(ESModule)两种形式
cjs模式主要用于服务端引用(ssr)
而esm就是我们现在经常使用的方式，它本身自带treeShaking而不需要额外配置按需引入(前提是你将模块分别导出)，非常好用~
其实到这里就已经可以直接打包了；
components下执行：
pnpm run build你就会发现打包了es和lib两个目录

到这里其实打包的组件库只能给js项目使用,在ts项目下运行会出现一些错误，而且使用的时候还会失去代码提示功能，这样的话我们就失去了用ts开发组件库的意义了。所以我们需要在打包的库里加入声明文件(.d.ts)。
那么如何向打包后的库里加入声明文件呢？其实很简单，只需要引入vite-plugin-dts
```ts
pnpm i vite-plugin-dts -D -w
```

然后修改一下我们的vite.config.ts引入这个插件
```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"
import dts from 'vite-plugin-dts'
 
export default defineConfig(
    {
        build: {...},
        plugins: [
            vue(),
            dts({
                //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
                tsConfigFilePath: '../../tsconfig.json'
            }),
            //因为这个插件默认打包到es下，我们想让lib目录下也生成声明文件需要再配置一个
            dts({
                outDir:'lib',
                tsconfigPath: '../../tsconfig.json'
            })
 
        ]
    }
)
```

因为这个插件默认打包到es下，我们想让lib目录下也生成声明文件需要再配置一个dts插件，暂时没有想到其它更好的处理方法~
然后执行打包命令你就会发现你的es和lib下就有了声明文件



## 问题处理
### 样式问题
样式问题
引入我们打包后的组件你会发现没有样式，所以你需要在全局引入我们的style.css才行；如 main.ts中需要
```
import 'zh-ui/es/style.css';
```
很显然这种组件库并不是我们想要的，我们需要的组件库是每个css样式放在每个组件其对应目录下，这样就不需要每次都全量导入我们的css样式。
下面就让我们来看下如何把样式拆分打包

#### 处理less文件
首先我们需要做的是将less打包成css然后放到打包后对应的文件目录下,我们在components下新建build文件夹来存放我们的一些打包工具,然后新建buildLess.ts,首先我们需要先安装一些工具cpy和fast-glob

```
pnpm i cpy fast-glob -D -w
```
cpy
它可以直接复制我们规定的文件并将我们的文件copy到指定目录,比如buildLess.ts:
```ts
import cpy from 'cpy'
import { resolve } from 'path'
 
const sourceDir = resolve(__dirname, '../src')
//lib文件
const targetLib = resolve(__dirname, '../zh-ui//lib')
//es文件
const targetEs = resolve(__dirname, '../zh-ui/es')
console.log(sourceDir);
const buildLess = async () => {
    await cpy(`${sourceDir}/**/*.less`, targetLib)
    await cpy(`${sourceDir}/**/*.less`, targetEs)
}
buildLess()
```
然后在package.json中新增命令
```json
"scripts": {
    "build": "vite build",
    "build:less": "esno build/buildLess"
  },

```

终端执行 pnpm run build:less 你就会发现lib和es文件对应目录下就出现了less文件.
但是我们最终要的并不是less文件而是css文件,所以我们要将less打包成css,所以我们需要用的less模块.在ts中引入less因为它本身没有声明文件所以会出现类型错误,所以我们要先安装它的 @types/less
```
pnpm i --save-dev @types/less -D -w
```
buildLess.ts如下(详细注释都在代码中)
```ts
import cpy from 'cpy'
import { resolve, dirname } from 'path'
import { promises as fs } from "fs"
import less from "less"
import glob from "fast-glob"
const sourceDir = resolve(__dirname, '../src')
//lib文件目录
const targetLib = resolve(__dirname, '../zh-ui/lib')
//es文件目录
const targetEs = resolve(__dirname, '../zh-ui/es')
 
//src目录
 
const srcDir = resolve(__dirname, '../src')
 
const buildLess = async () => {
    //直接将less文件复制到打包后目录
    await cpy(`${sourceDir}/**/*.less`, targetLib)
    await cpy(`${sourceDir}/**/*.less`, targetEs)
 
    //获取打包后.less文件目录(lib和es一样)
    const lessFils = await glob("**/*.less", { cwd: srcDir, onlyFiles: true })
 
    //遍历含有less的目录
    for (let path in lessFils) {
 
        const filePath = `${srcDir}/${lessFils[path]}`
        //获取less文件字符串
        const lessCode = await fs.readFile(filePath, 'utf-8')
        //将less解析成css
 
        const code = await less.render(lessCode, {
            //指定src下对应less文件的文件夹为目录
            paths: [srcDir, dirname(filePath)]
        })
 
        //拿到.css后缀path
        const cssPath = lessFils[path].replace('.less', '.css')
 
 
        //将css写入对应目录
        await fs.writeFile(resolve(targetLib, cssPath), code.css)
        await fs.writeFile(resolve(targetEs, cssPath), code.css)
    }
 
 
 
}
buildLess()
```

执行打包命令之后你会发现对应文件夹下多了.css文件
现在我已经将css文件放入对应的目录下了,但是我们的相关组件并没有引入这个css文件;所以我们需要的是每个打包后组件的index.js中出现如:
```
import "xxx/xxx.css"
```
之类的代码我们的css才会生效;所以我们需要对vite.config.ts进行相关配置
首先我们先将.less文件忽略**external: ['vue', /.less/],**这时候打包后的文件中如button/index.js就会出现
```
import "./style/index.less";
```
然后我们再将打包后代码的.less换成.css就大功告成了
```ts
plugins: [
            ...
 
            {
                name: 'style',
                generateBundle(config, bundle) {
                    //这里可以获取打包后的文件目录以及代码code
                    const keys = Object.keys(bundle)
 
                    for (const key of keys) {
                        const bundler: any = bundle[key as any]
                        //rollup内置方法,将所有输出文件code中的.less换成.css,因为我们当时没有打包less文件
 
                        this.emitFile({
                            type: 'asset',
                            fileName: key,//文件名名不变
                            source: bundler.code.replace(/\.less/g, '.css')
                        })
                    }
                }
            }
        ]
```
我们最终的vite.config.ts如下
```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";
export default defineConfig({
  build: {
    target: "modules",
    //打包文件目录
    outDir: "es",
    //压缩
    minify: true,
    //css分离
    //cssCodeSplit: true,
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue", /\.less/, "@zh/utils"],
      input: ["index.ts"],
      output: [
        {
          format: "es",
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: "[name].mjs",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: resolve(__dirname, "./zh/es"),
        },
        {
          format: "cjs",
          //不用打包成.cjs
          entryFileNames: "[name].js",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: resolve(__dirname, "./zh/lib"),
        },
      ],
    },
    lib: {
      entry: "./index.ts",
      name: "zh",
    },
  },

  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      outDir: [
        resolve(__dirname, "./zh/es/src"),
        resolve(__dirname, "./zh/lib/src"),
      ],
      //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
      tsconfigPath: "../../tsconfig.json",
    }),

    {
      name: "style",
      generateBundle(config, bundle) {
        //这里可以获取打包后的文件目录以及代码code
        const keys = Object.keys(bundle);

        for (const key of keys) {
          const bundler: any = bundle[key as any];
          //rollup内置方法,将所有输出文件code中的.less换成.css,因为我们当时没有打包less文件

          this.emitFile({
            type: "asset",
            fileName: key, //文件名名不变
            source: bundler.code.replace(/\.less/g, ".css"),
          });
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

 
```
最后我们将打包less与打包组件合成一个命令(package.json)
```json
"scripts": {
    "build": "vite build & esno build/buildLess"
  },
```
后续直接执行pnpm run build 即可完成所有打包啦


## 发布
其实后面就可以进行发布了，发布之前更改一下我们components下的package.json如下：
```json
{
  "name": "zh-ui",
  "version": "1.0.0",
  "main": "lib/index.js",
  "module":"es/index.js",
  "scripts": {
    "build": "vite build"
  },
  "files": [
    "es",
    "lib",
    "zh"
  ],
  "keywords": [
    "zh-ui",
    "vue3组件库"
  ],
  "author": "渐渐",
  "license": "MIT",
  "description": "",
  "typings": "lib/index.d.ts"
}
```
解释一下里面部分字段

pkg.module

我们组件库默认入口文件是传统的CommonJS模块，但是如果你的环境支持ESModule的话，构建工具会优先使用我们的module入口

pkg.files

files是指我们需要发布到npm上的目录，因为不可能components下的所有目录都被发布上去

开始发布
做了那么多终于到发布的阶段了；其实npm发包是很容易的，就拿我们的组件库kitty-ui举例吧

发布之前记得到npm[1]官网注册个账户,如果你要发布@xx/xx这种包的话需要在npm新建个组织组织组织名就是@后面的，比如我建的组织就是kitty-ui,注册完之后你就可以发布了

首先要将我们代码提交到git仓库，不然pnpm发布无法通过，后面每次发版记得在对应包下执行 pnpm version patch你就会发现这个包的版本号patch(版本号第三个数) +1 了，同样的 pnpm version major major和 pnpm version minor 分别对应版本号的第一和第二位增加。
如果你发布的是公共包的话，在对应包下执行
```
pnpm publish --access public
```
输入你的账户和密码（记得输入密码的时候是不显示的，不要以为卡了）正常情况下应该是发布成功了

注意
发布的时候要将npm的源切换到npm的官方地址(registry.npmjs.org/[2]); 如果你使用了其它镜像源的话


