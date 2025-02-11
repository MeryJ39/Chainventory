import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react"; // Importar los componentes necesarios
import Avvvatars from "avvvatars-react";
import Inventario from "../components/Inventario";

function ProfilePage() {
  const { user, logout } = useContext(AuthContext); // Obtener el usuario del contexto

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, redirige al login
      window.location.href = "/"; // o usa react-router para redirigir
    }
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <Card className="w-96">
        <CardHeader
          floated={false}
          className="h-80 flex justify-center items-center"
        >
          <Avvvatars
            value={user ? user.email : "user@gmail.com"}
            className="w-full h-full object-cover"
            size={300}
            style="character"
          ></Avvvatars>
        </CardHeader>

        <CardBody className="text-center">
          {/* Nombre de usuario */}
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {user ? user.username : "Cargando..."}
          </Typography>

          {/* Correo del usuario */}
          <Typography color="blue-gray" className="font-medium">
            {user ? user.email : "Cargando..."}
          </Typography>

          {/* Mostrar un mensaje de bienvenida */}
          <Typography variant="small" color="blue-gray" className="mt-4">
            ¡Bienvenido a tu perfil!
          </Typography>
        </CardBody>

        <CardFooter className="flex justify-center gap-7 pt-2">
          {/* Aquí pueden ir los botones de redes sociales */}
          <Tooltip content="Like">
            <Typography
              as="a"
              href="#facebook"
              variant="lead"
              color="blue"
              textGradient
            >
              <i className="fab fa-facebook" />
            </Typography>
          </Tooltip>
          <Tooltip content="Follow">
            <Typography
              as="a"
              href="#twitter"
              variant="lead"
              color="light-blue"
              textGradient
            >
              <i className="fab fa-twitter" />
            </Typography>
          </Tooltip>
          <Tooltip content="Follow">
            <Typography
              as="a"
              href="#instagram"
              variant="lead"
              color="purple"
              textGradient
            >
              <i className="fab fa-instagram" />
            </Typography>
          </Tooltip>
        </CardFooter>
      </Card>

      {/* Botón de cerrar sesión */}
      <div className="mt-4 text-center">
        <Button variant="outlined" onClick={logout} className="px-6 py-2">
          Cerrar sesión
        </Button>
      </div>

      <Inventario></Inventario>
    </div>
  );
}

export default ProfilePage;
