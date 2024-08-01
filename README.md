# Del Cyber Class

Proyek ini adalah aplikasi full-stack menggunakan React.js dan Node.js. Ikuti langkah-langkah di bawah ini untuk melakukan deploy ke Heroku.

## Deploy to Heroku

### Prerequisites
- Node.js and npm installed

### Steps

1. **Persiapkan Struktur Proyek**

   Pastikan struktur proyek Anda seperti ini: <br>
lms/ <br>
├───node_modules <br>
├───public <br>
└───src <br>
├───assets <br>
├───components <br>
├───CRUD Materi <br>
│ └───uploads <br> 
├───File Stealing <br>
│ ├───downloads <br>
│ └───my-files <br>
├───Login Backend <br>
│ └───node_modules <br>
├───Pages <br>
├───Tambah Praktikum <br>
├───XSS <br>


2. **Modifikasi package.json di Root`**

Add the following scripts to your root `package.json`: <br>
{ <br>
  "name": "delcyberclass", <br>
  "version": "0.1.0", <br>
  "scripts": { <br>
    "start": "concurrently \"npm run server1\" \"npm run server2\" \"npm run server3\" \"npm run server4\" \"npm run server5\" \"npm run client\"", <br>
    "server1": "node CRUD-Backend.js", <br>
    "server2": "node start-practicum.js", <br>
    "server3": "node login-register-backend.js", <br>
    "server4": "node TambahPraktikumBackend.js", <br>
    "server5": "node BackendXSS.js", <br>
    "client": "cd client && npm start", <br>
    "heroku-postbuild": "cd client && npm install && npm run build" <br>
  } <br>
} <br>

3. **Buat Procfile**
Buat file bernama Procfile di root proyek Anda dan tambahkan baris berikut: <br>
web: npm start <br>

4.  **Menjalankan Berbagai Server**
Untuk menjalankan semua file server dan client secara bersamaan, gunakan perintah berikut: <br>
npm start <br>

Perintah ini akan menjalankan semua server dan client menggunakan concurrently. <br>
