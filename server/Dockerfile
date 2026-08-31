FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-fund --no-audit

COPY . ./

EXPOSE 5000

CMD ["node", "server.js"]
