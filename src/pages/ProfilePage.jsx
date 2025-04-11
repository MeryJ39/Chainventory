import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import Avvvatars from "avvvatars-react";

function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState(user?.username || "");

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-[var(--background)] text-[var(--text)]">
      <Card className="w-full max-w-lg shadow-lg bg-[var(--background)] text-[var(--text)]">
        {/* Avatar */}
        <CardHeader
          floated={false}
          className="flex justify-center p-6 bg-[var(--primary)]"
        >
          <Avvvatars
            value={user?.username || "Usuario"}
            size={120}
            style="character"
          />
        </CardHeader>

        <CardBody className="text-center">
          {editMode ? (
            <Input
              label="Nombre de usuario"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
              className="bg-[var(--background)] text-[var(--text)]"
            />
          ) : (
            <Typography variant="h4" className="mb-2 text-[var(--text)]">
              {user?.username || "Usuario"}
            </Typography>
          )}

          <Typography variant="small" className="mt-4 text-[var(--text)]">
            ¡Bienvenido al sistema de inventario bovino!
          </Typography>
        </CardBody>

        <CardFooter className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Tooltip content="Editar perfil">
              <IconButton onClick={handleEditToggle}>
                <i className="fas fa-edit text-[var(--secondary)]" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Cerrar sesión">
              <IconButton onClick={logout}>
                <i className="text-red-500 fas fa-sign-out-alt" />
              </IconButton>
            </Tooltip>
          </div>

          {editMode && (
            <Button
              variant="filled"
              className="w-full bg-[var(--secondary)] text-white"
              onClick={() => setEditMode(false)}
            >
              Guardar cambios
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Sección de Actividad Reciente */}
      <Card className="w-full max-w-lg mt-5 shadow-lg bg-[var(--background)] text-[var(--text)]">
        <CardBody>
          <Typography variant="h6" className="mb-3 text-[var(--text)]">
            Actividad Reciente
          </Typography>
          <ul className="text-sm text-[var(--text)]">
            <li>✔️ Registraste 3 nuevas vacas en el sistema</li>
            <li>✔️ Actualizaste la información de la vaca #1234</li>
            <li>✔️ Se generó un informe de producción</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProfilePage;
