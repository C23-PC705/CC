# Tentukan base image yang akan digunakan
FROM node:14

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin seluruh file proyek ke dalam container
COPY . .

# Expose port yang akan digunakan oleh aplikasi Express
EXPOSE 8083

# Jalankan perintah untuk menjalankan aplikasi Express
CMD [ "npm", "start" ]

