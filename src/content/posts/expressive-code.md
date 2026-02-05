---
title: Expressive Code 记录
published: 2025-08-11
description: 如何使用Expressive Code 代码块及迁移踩坑记录
tags: [Markdown, Blogging, Demo]
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-11-21-58-55-image.png'
category: Default
draft: false
---

> 本文非站长原创，由 [Expressive code by yCENzh · Pull Request #27 · afoim/fuwari](https://github.com/afoim/fuwari/pull/27) 提供

:::note
原文链接:[Expressive Code Example](https://14131413.xyz/posts/default/expressive-code/)
:::

> ### 踩坑
> 
> 1. 首先按照fuwari原仓库commit进行修改,发现ac没推上去,构建第一次失败  
> 2. 推完ac后发现在ec中引用了三个插件,但是pnpm astro add并没有自动安装,第二次修改  
> 3. 现在正常跑起来了,但是由于2x主题的原因,样式很奇怪,再改一次
> 4. 这下正常了,推pr去
> 5. 没错我又回来了,滑块样式有问题,什么奇奇怪怪的圆角对不齐,干脆调小圆角
> 6. 应该是这个pr最后一次提交了,合并上游8个commit,不愧是劳模2x
> 7. 去tm的ANSI

Here, we'll explore how code blocks look using [Expressive Code](https://expressive-code.com/). The provided examples are based on the official documentation, which you can refer to for further details.
在这里，我们将探索使用 [Expressive Code](https://expressive-code.com/) 的代码块显示效果。提供的示例基于官方文档，您可以参考该文档获取更多细节。

## Expressive Code

### Syntax Highlighting

### 语法高亮

[Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)
[语法高亮](https://expressive-code.com/key-features/syntax-highlighting/)

#### Regular syntax highlighting

#### 常规语法高亮

```js
console.log('This code is syntax highlighted!')
```

### Editor & Terminal Frames

### 编辑器与终端框架

[Editor & Terminal Frames](https://expressive-code.com/key-features/frames/)
[编辑器与终端框架](https://expressive-code.com/key-features/frames/)

#### Code editor frames

#### 代码编辑器框架

```js
console.log('Title attribute example')
```

---

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

#### Terminal frames

#### 终端框架

```bash
echo "This terminal frame has no title"
```

---

```powershell
Write-Output "This one has a title!"
```

#### Overriding frame types

#### 覆盖框架类型

```sh
echo "Look ma, no frame!"
```

---

```ps
# Without overriding, this would be a terminal frame
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### Text & Line Markers

### 文本与行标记

[Text & Line Markers](https://expressive-code.com/key-features/text-markers/)
[文本与行标记](https://expressive-code.com/key-features/text-markers/)

#### Marking full lines & line ranges

#### 标记整行与行范围

```js
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

#### Selecting line marker types (mark, ins, del)

#### 选择行标记类型（mark, ins, del）

```js
function demo() {
  console.log('this line is marked as deleted')
  // This line and the next one are marked as inserted
  console.log('this is the second inserted line')

  return 'this line uses the neutral default marker type'
}
```

#### Adding labels to line markers

#### 为行标记添加标签

```jsx
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### Adding long labels on their own lines

#### 在独立行添加长标签

```jsx
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### Using diff-like syntax

#### 使用类似 diff 的语法

```diff
+this line will be marked as inserted
-this line will be marked as deleted
this is a regular line
```

---

```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+this is an actual diff file
-all contents will remain unmodified
 no whitespace will be removed either
```

#### Combining syntax highlighting with diff-like syntax

#### 结合语法高亮与类似 diff 的语法

```diff
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

#### Marking individual text inside lines

#### 标记行内特定文本

```js
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}
```

#### Regular expressions

#### 正则表达式

```ts
console.log('The words yes and yep will be marked.')
```

#### Escaping forward slashes

#### 转义正斜杠

```sh
echo "Test" > /home/test.txt
```

#### Selecting inline marker types (mark, ins, del)

#### 选择行内标记类型（mark, ins, del）

```js
function demo() {
  console.log('These are inserted and deleted marker types');
  // The return statement uses the default marker type
  return true;
}
```

## Collapsible Sections

## 可折叠部分

[Collapsible Sections](https://expressive-code.com/plugins/collapsible-sections/)
[可折叠部分](https://expressive-code.com/plugins/collapsible-sections/)

```js
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1
  const b = 2
  const c = a + b

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`)
  return c
}

// All this code until the end of the block will be collapsed again
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: 'End of example boilerplate code' })
```

## Line Numbers

## 行号

[Line Numbers](https://expressive-code.com/plugins/line-numbers/)
[行号](https://expressive-code.com/plugins/line-numbers/)

### Displaying line numbers per block

### 按代码块显示行号

```js
// This code block will show line numbers
console.log('Greetings from line 2!')
console.log('I am on line 3')
```

---

```js
// Line numbers are disabled for this block
console.log('Hello?')
console.log('Sorry, do you know what line I am on?')
```

### Changing the starting line number

### 更改起始行号

```js
console.log('Greetings from line 5!')
console.log('I am on line 6')
```
