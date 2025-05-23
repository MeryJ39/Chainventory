import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/authContext.jsx";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // Importa Dashboard
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Productos from "./pages/Productos.jsx";
import Movimientos from "./pages/Movimientos.jsx";
import Vacunaciones from "./pages/Vacunaciones.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Analiticas from "./pages/Analiticas.jsx";
import Informes from "./pages/Informes.jsx";
import Auditorias from "./pages/Auditorias.jsx";
import Animales from "./pages/Animales.jsx";
import Ventas from "./pages/Ventas.jsx";
import AnimalesDisponibles from "./pages/AnimalesDisponibles.jsx";
import Preview from "./pages/preview.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/preview" element={<Preview />} />
              {/* Renderiza Dashboard directamente */}
              {/* ... otras rutas anidadas */}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/inventario" element={<AnimalesDisponibles />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Analiticas />} />
              <Route path="informes" element={<Informes />} />
              <Route path="auditorias" element={<Auditorias />} />

              {/* Dashboard como ruta padre */}
              <Route path="productos" element={<Productos />} />
              {/* Rutas anidadas */}
              <Route path="movimientos" element={<Movimientos />} />
              {/* Otras rutas de Dashboard */}
              <Route path="vacunaciones" element={<Vacunaciones />} />
              <Route
                path="usuarios"
                element={
                  <ProtectedRoute allowedRoles={["administrador"]}>
                    <Usuarios></Usuarios>
                  </ProtectedRoute>
                }
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="animales" element={<Animales></Animales>} />
              <Route path="ventas" element={<Ventas></Ventas>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
