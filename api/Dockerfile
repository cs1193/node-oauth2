FROM node:boron

MAINTAINER Chandresh Rajkumar Manonmani <chandresh.rm@gmail.com> <cs1193@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

ENV HOST 0.0.0.0
ENV PORT 38143

ENV DATASTORE_HOST naone.datastore
ENV DATASTORE_PORT 27017
ENV DATASTORE_NAME oauth

ENV SECRET_KEY 875ada1df066b1bddb31ed41a4c68cd9

COPY . /usr/src/app

EXPOSE 38143

CMD ["npm", "run", "start"]
