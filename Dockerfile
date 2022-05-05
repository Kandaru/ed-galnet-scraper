FROM node
WORKDIR /usr/src/app
USER root

RUN apt-get update && apt-get install -y chromium

COPY . .
RUN npm install

CMD npm run start
