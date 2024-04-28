FROM node:20.9-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ARG API_URL=BAKED_API_URL
RUN npm run build
EXPOSE 3000
CMD ["/app/start.sh"]