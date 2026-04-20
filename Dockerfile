FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create .env file for container with Docker database URL
RUN echo "DATABASE_URL=postgres://user:password@db:5432/jans_pos" > .env
RUN echo "JWT_SECRET=jans-super-secret-key-2024" >> .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]