FROM node:18-bookworm-slim as builder

RUN mkdir -p /app
WORKDIR /app
COPY package* /app
RUN npm install && npm run build

FROM node:18-bookworm-slim
RUN apt-get update -y && mkdir -p /app/dist
WORKDIR /app
COPY package* /app
RUN npm install --production
COPY --from=builder /app/dist /app/dist/




