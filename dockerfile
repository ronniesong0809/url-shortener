FROM node:16-alpine
WORKDIR '/app'
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . /app
EXPOSE 5000
CMD ["npm", "run", "start"]