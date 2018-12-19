# HDesk

## 为什么做？
 这么多年，经历使用过`Bugzilla`、`TD`、`QC`、`Jira`、`Bugfree`、`Mantis`、`禅道`.....
 希望有一个：简单、轻便、优美、现代的测试管理工具

## 技术
 系统完全前后端分离
 - 前端: Vue + Nuxt + ElementUI + eCharts
 - 后端：Python3 + Django + Mysql + Nginx

## 功能
 目前主要实现了如下功能：
 - 缺陷管理 （缺陷列表、查询、搜索、新增、删除、编辑、分配、解决、关闭、重新打开、延期挂起、统计、分析等)
 - 测试用例管理 (测试用例创建、编辑、删除、评审、统计、运行)
 - 产品管理 （产品管理、版本管理、人员管理、模块管理）
 - 用户管理 （用户管理、增加、删除、修改密码）
 - 系统管理（api、page、日志管理）

## 问题
 为什么没有需求、任务进度等功能？
 `因为具体的功能实现、UI正在梳理中，后续会增加`
 > API自动化测试模块正在开发中
 备注：如果您有更好的解决方案，却苦于无法实现，请联系我。

## 安装
 安装文档见[INSTALL.md](INSTALL.md)
 ```
$ git clone git@github.com:HereDesk/HDesk.git
$ cd HDesk
$ npm install
$ npm install axios --save
$ npm install echarts --save
$ npm install element-ui --save
$ npm run dev 或者 nuxt dev
```
 接口见[HDesk-server](https://github.com/HereDesk/HDesk-server)

## 截图
 > 其它的截图见screenshot目录
 图一：（首页）
 ![home](screenshot/home.png)
