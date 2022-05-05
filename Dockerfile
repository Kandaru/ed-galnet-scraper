FROM node:alpine
WORKDIR /usr/src/app
USER root

COPY . .
RUN npm install

CMD npm run start
