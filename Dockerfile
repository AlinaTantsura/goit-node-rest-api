FROM node

WORKDIR /GOIT-NODE-REST-API

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]