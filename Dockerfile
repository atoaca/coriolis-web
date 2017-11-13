FROM node:9.1.0

# Set a working directory
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

# Set CORIOLIS_URL
ENV CORIOLIS_URL http://127.0.0.1
ENV PORT 3000

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]