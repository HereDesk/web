#!/bin/bash
# 本脚本用于包的生成

# 删除当前目录下的client
rm -rf client*.tar.bz2

# 打包
./node_modules/nuxt/bin/nuxt.js generate

# 压缩
tar -jcvf client.tar.bz2 client

# 压缩后删除
rm -rf client