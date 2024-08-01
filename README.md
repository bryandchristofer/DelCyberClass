# Del Cyber Class

Proyek ini adalah aplikasi full-stack menggunakan React.js dan Node.js. Ikuti langkah-langkah di bawah ini untuk melakukan deploy ke Heroku.

## Deploy to Heroku

### Prerequisites
- Node.js and npm installed

### Steps

1. **Persiapkan Struktur Proyek**

   Pastikan struktur proyek Anda seperti ini:
lms/
├───node_modules
├───public
└───src
├───assets
├───components
├───CRUD Materi
│ └───uploads
├───File Stealing
│ ├───downloads
│ └───my-files
├───Login Backend
│ └───node_modules
├───Pages
├───Tambah Praktikum
├───XSS


2. **Modifikasi package.json di Root`**

Add the following scripts to your root `package.json`:
{
  "name": "delcyberclass",
  "version": "0.1.0",
  "scripts": {
    "start": "concurrently \"npm run server1\" \"npm run server2\" \"npm run server3\" \"npm run server4\" \"npm run server5\" \"npm run client\"",
    "server1": "node CRUD-Backend.js",
    "server2": "node start-practicum.js",
    "server3": "node login-register-backend.js",
    "server4": "node TambahPraktikumBackend.js",
    "server5": "node BackendXSS.js",
    "client": "cd client && npm start",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}

3. **Buat Procfile**
Buat file bernama Procfile di root proyek Anda dan tambahkan baris berikut:
web: npm start

4.  **Menjalankan Berbagai Server**
Untuk menjalankan semua file server dan client secara bersamaan, gunakan perintah berikut:
npm start

Perintah ini akan menjalankan semua server dan client menggunakan concurrently.