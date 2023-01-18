FROM node:16

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run db:migrate

CMD ["npm", "start"]