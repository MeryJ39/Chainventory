import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Input, Button, Typography, Checkbox } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { login, loading } = useContext(AuthContext); // 🔥 Usamos el contexto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username, password);

    if (result.success) {
      alert(`✅ Bienvenido, ${username}`);
      navigate("/dashboard");
    } else {
      alert(`❌ Error en login: ${result.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 md:flex-row bg-text">
      <div className="flex flex-col w-full max-w-4xl mx-auto overflow-hidden shadow-lg md:flex-row bg-background rounded-3xl">
        <div
          className="hidden bg-center bg-cover md:block md:w-1/2"
          style={{ backgroundImage: "url('/src/assets/portrait.jpg')" }}
        ></div>

        <div className="w-full p-6 my-10 lg:w-1/2 lg:p-10">
          <div className="w-full">
            <Typography variant="h4" className="mb-4 text-center">
              Iniciar sesión
            </Typography>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Typography variant="small" className="font-normal">
                Nombre de Usuario
              </Typography>
              <Input
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="text-text appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900"
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
                  placeholder="********"
                  className="text-text appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-100 placeholder:opacity-100 focus:!border-t-gray-900"
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
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
