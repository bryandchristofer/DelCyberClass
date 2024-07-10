import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectRoute from "./ProtectRoute";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import HomePageUser from "./Pages/HomePageUser";
import HomePageAdmin from "./Pages/HomePageAdmin";
import HomePageAuthor from "./Pages/HomePageAuthor";
import Materi from "./Pages/Materi";
import MateriAuthor from "./Pages/MateriAuthor";
import PraktikumAuthor from "./Pages/PraktikumAuthor";
import TambahPraktikum from "./Tambah Praktikum/TambahPraktikum";
import EditPraktikum from "./Tambah Praktikum/EditPraktikum";
import DetailPraktikum from "./Tambah Praktikum/DetailPraktikum";
import TambahPengajar from "./Pages/TambahPengajar";
import Praktikum from "./Pages/Praktikum";
import XSS from "./XSS Frontend/XSS";
import PanduanXSS from "./Pages/PanduanXSS";
import TambahMateri from "./CRUD Materi/TambahMateri";
import MateriDetail from "./CRUD Materi/MaterialDetail";
import EditMateri from "./CRUD Materi/EditMateri";
import FileStealing from "./File Stealing/FileStealing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/beranda"
          element={
            <ProtectRoute allowedRoles={["user"]}>
              <HomePageUser />
            </ProtectRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectRoute allowedRoles={["admin"]}>
              <HomePageAdmin />
            </ProtectRoute>
          }
        />
        <Route
          path="/author"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <HomePageAuthor />
            </ProtectRoute>
          }
        />
        <Route
          path="/materi"
          element={
            <ProtectRoute allowedRoles={["user"]}>
              <Materi />
            </ProtectRoute>
          }
        />
        <Route
          path="/materi-author"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <MateriAuthor />
            </ProtectRoute>
          }
        />
        <Route
          path="/praktikum"
          element={
            <ProtectRoute allowedRoles={["user"]}>
              <Praktikum />
            </ProtectRoute>
          }
        />
        <Route
          path="/praktikum-author"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <PraktikumAuthor />
            </ProtectRoute>
          }
        />
        <Route path="/praktikum/:slug" element={<DetailPraktikum />} />
        <Route
          path="/tambah-pengajar"
          element={
            <ProtectRoute allowedRoles={["admin"]}>
              <TambahPengajar />
            </ProtectRoute>
          }
        />
        <Route path="/xss" element={<XSS />} />
        <Route path="/panduan-xss" element={<PanduanXSS />} />
        <Route path="/file-stealing" element={<FileStealing />} />
        <Route path="/materi/:slug" element={<MateriDetail />} />
        <Route
          path="/tambah-materi"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <TambahMateri />
            </ProtectRoute>
          }
        />
        <Route
          path="/tambah-praktikum"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <TambahPraktikum />
            </ProtectRoute>
          }
        />
        <Route
          path="/edit-praktikum/:id"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <EditPraktikum />
            </ProtectRoute>
          }
        />
        <Route
          path="/edit-materi/:id"
          element={
            <ProtectRoute allowedRoles={["author"]}>
              <EditMateri />
            </ProtectRoute>
          }
        />
        <Route path="/materi/:id" element={<MateriDetail />} />
        {/* Anda bisa menambahkan lebih banyak rute di sini */}
      </Routes>
    </Router>
  );
}

export default App;
