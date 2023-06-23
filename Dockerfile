FROM node:latest

#Preconfigurar el contenido con la imagen

WORKDIR /app

#Copiar los elementos necesarios para construir la app

COPY package-lock.json .
COPY package.json .

#Construir dependencias
RUN npm install

#Copiar codigo fuente
COPY . .
