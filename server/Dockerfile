FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --no-fund --no-audit

COPY server/ ./

EXPOSE 5000

CMD ["node", "server.js"]
