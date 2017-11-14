FROM oraclelinux:7

WORKDIR /root

RUN curl --silent --location https://rpm.nodesource.com/setup_9.x | bash -
RUN yum install -y nodejs
RUN curl -o /etc/yum.repos.d/yarn.repo https://dl.yarnpkg.com/rpm/yarn.repo
RUN yum install -y yarn

ADD . coriolis-web
WORKDIR coriolis-web
RUN yarn install

ENV CORIOLIS_URL https://10.89.13.79/

#RUN cp ./src/config.sample.js ./src/config.js
RUN yarn build

ENTRYPOINT [ "node", "server.js" ]

EXPOSE 3001