FROM node:10-alpine
RUN mkdir /code
WORKDIR /code
RUN npm install -g yarn

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY ./ .
RUN yarn build
RUN yarn --production

CMD ["yarn", "start"]

