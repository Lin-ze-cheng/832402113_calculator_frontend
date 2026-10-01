# Calculator Frontend

这是前后端分离计算器的浏览器客户端。前端只负责用户交互、表达式输入、结果展示和历史记录展示，核心计算全部由后端完成。

作者：832402113 林泽成

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript
- Fetch API

## 本地运行

推荐使用 VS Code 的 Live Server 打开 `index.html`。

也可以在当前目录运行：

```powershell
python -m http.server 5500
```

然后访问：<http://127.0.0.1:5500>

后端默认地址为：

```text
http://127.0.0.1:8000
```

请确保后端已经启动。

## 连接部署后的后端

部署前端时，应修改 `config.js`，将 API 地址配置为实际后端 HTTPS 地址：

```javascript
window.CALCULATOR_API_BASE = "https://你的后端域名.example";
```

部署后必须同时在后端设置正确的 `CALCULATOR_CORS_ORIGINS`。

## 功能

- 按钮或键盘输入表达式。
- Enter 计算，Esc 清空。
- 展示后端返回的结果和错误。
- 查询数据库历史记录。
- 删除指定记录。
- 清空全部记录。
- 展示后端连接状态。
- 适配桌面和移动设备。
