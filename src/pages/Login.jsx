import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
  Checkbox,
  ButtonGroup,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Credenciales incorrectas o error en el servidor.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 md:flex-row bg-text">
      <div className="flex flex-col w-full max-w-4xl mx-auto overflow-hidden shadow-lg md:flex-row bg-background rounded-3xl">
        {/* Imagen para pantallas grandes */}
        <div
          className="hidden bg-center bg-cover md:block md:w-1/2"
          style={{ backgroundImage: "url('/src/assets/portrait.jpg')" }}
        ></div>

        {/* Formulario de inicio de sesión */}
        <div className="w-full p-6 my-10 lg:w-1/2 lg:p-10">
          <div className="w-full">
            <Typography variant="h4" className="mb-4 text-center">
              Iniciar sesión
            </Typography>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Typography variant="small" className="font-normal ">
                Correo electrónico
              </Typography>
              <Input
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-text appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography variant="small" className="font-normal">
                Contraseña
              </Typography>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" text-text appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-100 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <Button
                  size="sm"
                  type="button"
                  className="!absolute right-1 top-1 rounded bg-background text-text"
                  disabled={!password}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </Button>
              </div>

              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center font-normal text-accent "
                  >
                    Recordarme
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />

              <Button
                type="submit"
                variant="filled"
                fullWidth
                className="bg-primary text-background"
              >
                Iniciar sesión
              </Button>
            </form>

            <Typography
              variant="small"
              className="mt-4 text-center text-accent"
            >
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-bold text-text hover:underline hover:text-secondary"
              >
                Regístrate
              </button>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
