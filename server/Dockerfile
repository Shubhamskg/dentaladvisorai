FROM node

RUN apt-get update
WORKDIR /app

COPY package.json package.json

COPY package-lock.json package-lock.json
RUN  npm install

COPY . .



ENTRYPOINT [ "node","app.js" ]