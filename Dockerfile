# 使用轻量级的 Nginx 基础镜像
FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 复制构建好的静态文件到 Nginx 的默认网站目录
COPY .output/public/ ./

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 13175

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"] 