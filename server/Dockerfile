FROM node:20.9-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
EXPOSE  3001
CMD [ "npm", "run", "start:migrate" ]
#devmode
# CMD ["npm", "run", "dev"] 
