FROM node:12.22.1-alpine

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn --production 

COPY [".", "."]

CMD [ "yarn", "start" ]