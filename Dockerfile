FROM node:20-alpine3.21 AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build
# RUN npm run prisma:build

FROM node:20-alpine3.21 AS runner

LABEL author.name="月上老狗"
LABEL author.email="dingdangdogx@outlook.com"
LABEL project.name="easyimage.work"
LABEL project.version="1.2.5"

# 安装 fontconfig (字体配置工具)
RUN apk add --no-cache fontconfig
RUN apk add --no-cache font-noto
RUN fc-cache -fv

WORKDIR /app

# 复制生产环境需要的文件
COPY --from=builder /app/.output/ ./ 

ENV PORT="13175"

EXPOSE 13175

CMD ["node", "server/index.mjs"]
# ENTRYPOINT ["/app/entrypoint.sh"]
