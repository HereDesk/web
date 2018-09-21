#!/bin/bash
# 本脚本用于包的生成

# 删除当前目录下的dist
rm -rf dist*.tar.bz2

# 打包
./node_modules/nuxt/bin/nuxt generate

# 压缩
tar -jcvf dist.tar.bz2 dist