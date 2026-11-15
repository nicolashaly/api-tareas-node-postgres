FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# src/generated/prisma está en .gitignore: se genera aquí
RUN npx prisma generate

EXPOSE 5001

CMD ["node", "src/server.js"]
