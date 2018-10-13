#!/bin/bash
# 本脚本用于部署服务器

# 服务器IP
server_ip="45.76.190.147"

# 删除当前目录下的dist
rm -rf dist*

# 打包
./node_modules/nuxt/bin/nuxt generate

# 压缩
tar -jcvf dist.tar.bz2 dist

# 传输
scp dist.tar.bz2 root@$server_ip:/opt/here_desk/

# shh远程访问,并执行远程服务器上的脚本
ssh root@$server_ip "shell.sh"