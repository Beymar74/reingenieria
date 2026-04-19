# Usa una imagen base de Node.js 18
FROM node:18-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación Next.js
EXPOSE 3000

# Comando para iniciar la aplicación en modo de desarrollo
CMD ["npm", "run", "dev"]
