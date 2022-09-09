FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts

COPY . .

CMD [ "npm", "start" ]
