FROM node:alpine
COPY . /app
ENV NODE_ENV=dev
ENV MongoDbUrl="mongodb://mongodb:27017/books"
WORKDIR /app
CMD npm i
EXPOSE 3000
CMD npm start
