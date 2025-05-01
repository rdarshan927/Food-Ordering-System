FROM node:22.9.0
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
