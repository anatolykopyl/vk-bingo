FROM node:20-alpine
LABEL authors="anatolykopyl"

WORKDIR /usr/node/app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
