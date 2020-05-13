FROM node:14.2.0-alpine

RUN apk add git
RUN npm install -g http-server

COPY yarn.lock /
COPY package.json /
COPY tsconfig.json /

RUN yarn install

COPY src /src
RUN yarn build

RUN apk del git

EXPOSE 8080
CMD ["http-server", "/dist", "-p", "8080", "-a", "0.0.0.0"]
