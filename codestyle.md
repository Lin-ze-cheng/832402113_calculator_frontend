# 前端代码规范

本项目的 HTML、CSS 和 JavaScript 规范主要参考：

- [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

## 主要规则

- HTML 使用语义化元素，并为交互控件提供可理解的标签。
- HTML、CSS 和 JavaScript 使用 2 个空格缩进。
- JavaScript 变量和函数使用 `camelCase`。
- 常量使用 `UPPER_SNAKE_CASE`。
- 优先使用 `const`，只有需要重新赋值时才使用 `let`。
- 不使用 `var`、`eval` 或内联事件处理器。
- API 请求统一经过 `apiRequest` 处理。
- 用户数据通过 `textContent` 写入页面，避免直接拼接为 HTML。
- CSS 使用有意义的类名和自定义属性管理颜色。
- 所有异步请求都需要提供成功、失败和加载状态。

