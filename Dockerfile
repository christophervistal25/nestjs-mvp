FROM node:20.14.0 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.14.0 As production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
