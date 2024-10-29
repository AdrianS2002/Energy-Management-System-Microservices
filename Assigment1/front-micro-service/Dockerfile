# Etapa 1: Construirea aplicației
FROM node:20.9.0 AS build

WORKDIR /app

# Copiază fișierele package.json și package-lock.json și instalează dependențele
COPY package*.json ./ 
RUN npm install

# Copiază restul fișierelor proiectului și construiește aplicația
COPY . . 
RUN npm run build

# Etapa 2: Configurarea serverului Nginx pentru a servi aplicația
FROM nginx:alpine

# Copiază fișierul de configurare Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiază fișierele construite din etapa de build în directorul de lucru al Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expune portul 80 pentru accesul la aplicația frontend
EXPOSE 80

# Comandă pentru rularea serverului Nginx
CMD ["nginx", "-g", "daemon off;"]
