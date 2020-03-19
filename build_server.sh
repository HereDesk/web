#!/bin/bash
# 本脚本用于部署服务器

# 服务器IP
server_ip="192.168.12.201"

# 删除当前目录下的dist
rm -rf client*

# 打包
./node_modules/nuxt/bin/nuxt.js generate

# 压缩
tar -jcvf client.tar.bz2 client

# 传输
scp client.tar.bz2 apple@$server_ip:/Users/apple/Documents/HDesk/HDesk

# shh远程访问,并执行远程服务器上的脚本
# ssh apple@$server_ip "shell.sh"
