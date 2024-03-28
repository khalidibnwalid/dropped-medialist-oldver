FROM node:20.9 
# to fix -alpine have problems with prisma
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
EXPOSE  3001
CMD [ "npm", "run", "start:migrate" ]
#devmode
# CMD ["npm", "run", "dev"] 
