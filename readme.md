# logseq-oxford-dictionary plugin

这个项目的功能是从网页解析Oxford Dictionary中的单词释义和例句。

目前由于CORS问题，需要本地搭建一个代理访问Oxford Dictionary才能使用

- 方式一：本地运行 `proxy.py` 通过fastapi进行代理
- 方式二：使用Cloudflare的Worker直接把`cloudflare_worker.js`粘贴进去部署就行了

2023-04-05: 新增配置查询单词的URL，方便使用自己部署的worker

## TODO

- [x] 支持一词多词性查询，同时返回
- [x] 查询失败处理
- [x] 寻找一种不需要使用代理的方法（现在可以部署到Cloudflare Worker，算是一种曲线方案吧）
- [x] 添加单词查询URL请求配置
- [ ] 增加github action
- [ ] 代码优化（第一次写typescript，写的太糟糕了）
- [ ] 输出格式添加高亮等优化
- [ ] 新功能，一行输入多个单词返回单词区别 `/word_diff`
- [ ] 新功能，一行输入多个单词返回一个故事 `/word_story`

## Usage

![short cut](shortcut.gif)