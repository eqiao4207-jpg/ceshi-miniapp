# 管理端

`index.html` 是可直接上传到 uniCloud 前端网页托管的静态管理台。

当前页面包含演示数据，真实数据接入需要加载 uniCloud Web SDK 后调用：

```js
adminCloud.call('admin-dashboard')
adminCloud.call('admin-orders', { page: 1, pageSize: 20 })
adminCloud.call('admin-tests')
```

管理员 Token 只保存在当前浏览器会话的 `sessionStorage`，不要写入源码或提交 Git。云函数仍会在服务端校验 `ADMIN_TOKEN`。
