import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import ThemeToggle from "../components/ThemeToggle";

const Register = () => {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Error durante el registro:", error);
      alert("Error durante el registro, por favor intente nuevamente.");
    }
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Formulario */}
      <div className="flex items-center justify-center w-full p-4 md:w-1/2 bg-background">
        <Card
          color="transparent"
          shadow={false}
          className="w-full max-w-md p-6 text-text"
        >
          <Typography variant="h4">Registro de Usuario</Typography>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Typography variant="h6">Nombre de Usuario</Typography>
              <Input
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 text-text"
              />
            </div>
            <div>
              <Typography variant="h6">Correo Electrónico</Typography>
              <Input
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@hotmail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 text-text"
              />
            </div>
            <div>
              <Typography variant="h6">Contraseña</Typography>
              <Input
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 text-text"
              />
            </div>
            <Checkbox
              label={
                <Typography variant="small" className="text-sm text-accent">
                  Acepto los{" "}
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-secondary"
                  >
                    Términos y Condiciones
                  </a>
                </Typography>
              }
            />
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              className="bg-primary text-background"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
            <Typography className="mt-4 text-center text-accent">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="font-medium text-text hover:text-secondary"
              >
                Inicia sesión
              </a>
            </Typography>
          </form>
        </Card>
      </div>

      {/* Imagen */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-brown-900 bg-blend-overlay ">
        <img
          src="/src/assets/viewport.jpg"
          alt="Descripción de la imagen"
          className="object-cover w-full h-full opacity-50"
        />
      </div>
    </div>
  );
};

export default Register;
