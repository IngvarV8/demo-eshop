FROM node:22.14.0
WORKDIR /app

COPY package.json tsconfig.json package-lock.json ./
COPY ./src/server.ts ./src/
COPY ./compiled ./compiled

RUN npm install

CMD ["npm", "run", "start"]