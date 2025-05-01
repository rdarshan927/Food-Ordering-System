FROM node:22.9.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5052
CMD ["node", "server.js"]