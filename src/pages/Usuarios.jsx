import { useState, useEffect } from "react";
import {
  listarUsuarios,
  registrarUsuario,
  eliminarUsuario,
  cambiarRol,
  cambiarContraseña,
} from "../services/usuarioService";
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const ROLES = {
  administrador: "Administrador",
  encargado: "Encargado",
};

// Función para validar la contraseña y obtener los requisitos faltantes
const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every((val) => val);
  const missingRequirements = Object.entries(requirements)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, met]) => !met)
    .map(([key]) => key);

  return { isValid, requirements, missingRequirements };
};

const getRequirementText = (key) => {
  const texts = {
    length: "Mínimo 8 caracteres",
    hasUpperCase: "Al menos una mayúscula (A-Z)",
    hasLowerCase: "Al menos una minúscula (a-z)",
    hasNumber: "Al menos un número (0-9)",
    hasSymbol: "Al menos un símbolo (!@#$%^&*)",
  };
  return texts[key] || key;
};

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChangePassDialog, setOpenChangePassDialog] = useState(false);
  const [openChangeRoleDialog, setOpenChangeRoleDialog] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
    },
    missingRequirements: [],
  });

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    rol: "usuario",
  });

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usuarios = await listarUsuarios();
        setUsers(usuarios);
      } catch (error) {
        console.error("Error al listar usuarios:", error);
        setError("Error al obtener usuarios");
        toast.error("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Manejar cambio de contraseña en el formulario
  const handlePasswordChange = (password) => {
    setNewUser({ ...newUser, password });
    const validation = validatePassword(password);
    setPasswordValidation(validation);
  };

  // Manejar cambio de nueva contraseña en el diálogo
  const handleNewPasswordChange = (password) => {
    setNewPassword(password);
    const validation = validatePassword(password);
    setPasswordValidation(validation);
  };

  // Manejar creación de usuario
  const handleCreate = async () => {
    if (!newUser.username || !newUser.password) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.warn("La contraseña no cumple con los requisitos de seguridad");
      return;
    }

    setLoading(true);
    try {
      await registrarUsuario(newUser.username, newUser.password, newUser.rol);
      toast.success(`Usuario ${newUser.username} registrado con éxito`);

      const usuariosActualizados = await listarUsuarios();
      setUsers(usuariosActualizados);
      setNewUser({ username: "", password: "", rol: "usuario" });
      setPasswordValidation({
        isValid: false,
        requirements: {
          length: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSymbol: false,
        },
        missingRequirements: [],
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      toast.error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async () => {
    if (!userToAction) return;

    setLoading(true);
    try {
      await eliminarUsuario(userToAction.username);
      toast.success(`Usuario ${userToAction.username} desactivado`);

      const usuariosActualizados = await listarUsuarios();
      setUsers(usuariosActualizados);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al desactivar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de contraseña
  const handleChangePassword = async () => {
    if (!userToAction || !newPassword) {
      toast.warn("Ingresa una nueva contraseña");
      return;
    }
    if (!passwordValidation.isValid) {
      toast.warn("La contraseña no cumple con los requisitos de seguridad");
      return;
    }

    setLoading(true);
    try {
      await cambiarContraseña(userToAction.username, newPassword);
      toast.success(`Contraseña de ${userToAction.username} actualizada`);

      setOpenChangePassDialog(false);
      setNewPassword("");
      setPasswordValidation({
        isValid: false,
        requirements: {
          length: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSymbol: false,
        },
        missingRequirements: [],
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error("Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de rol
  const handleChangeRole = async (newRole) => {
    if (!userToAction) return;

    setLoading(true);
    try {
      await cambiarRol(userToAction.username, newRole);
      toast.success(
        `Rol de ${userToAction.username} actualizado a ${ROLES[newRole]}`
      );

      const usuariosActualizados = await listarUsuarios();
      setUsers(usuariosActualizados);
      setOpenChangeRoleDialog(false);
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      toast.error("Error al cambiar rol");
    } finally {
      setLoading(false);
    }
  };

  // Formatear estado del usuario
  const getStatusChip = (activo) => (
    <Chip
      value={activo ? "Activo" : "Inactivo"}
      color={activo ? "green" : "red"}
      className="text-xs"
    />
  );

  // Componente para mostrar los requisitos de la contraseña
  // eslint-disable-next-line react/prop-types
  const PasswordRequirements = ({ requirements }) => {
    return (
      <div className="mt-2">
        <Typography variant="small" className="font-medium text-gray-700">
          Requisitos de la contraseña:
        </Typography>
        <List className="p-0">
          {Object.entries(requirements).map(([key, met]) => (
            <ListItem key={key} className="p-0">
              <ListItemPrefix className="w-5 h-5">
                {met ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
              </ListItemPrefix>
              <Typography
                variant="small"
                className={`font-normal ${
                  met ? "text-green-500" : "text-red-500"
                }`}
              >
                {getRequirementText(key)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Typography variant="h2" className="mb-6 text-3xl font-bold">
        Gestión de Usuarios
      </Typography>

      {/* Mensajes de estado */}
      {loading && users.length === 0 && (
        <div className="flex justify-center">
          <Typography variant="h5">Cargando usuarios...</Typography>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 text-red-600 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de Usuarios */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {users.map((user) => (
          <Card
            key={user.username}
            className="border rounded-lg shadow-sm bg-background"
          >
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" className="font-semibold text-text">
                    {user.username}
                  </Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip
                      value={ROLES[user.rol]}
                      color={user.rol === "administrador" ? "gray" : "blue"}
                      variant={
                        user.rol === "administrador" ? "gradient" : "ghost"
                      }
                      className="text-xs"
                    />
                    {getStatusChip(user.activo)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Tooltip content="Cambiar contraseña">
                    <IconButton
                      variant="text"
                      color="blue"
                      onClick={() => {
                        setUserToAction(user);
                        setOpenChangePassDialog(true);
                      }}
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip content="Cambiar rol">
                    <IconButton
                      variant="text"
                      color="amber"
                      onClick={() => {
                        setUserToAction(user);
                        setOpenChangeRoleDialog(true);
                      }}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip content={user.activo ? "Desactivar" : "Activar"}>
                    <IconButton
                      variant="text"
                      color={user.activo ? "red" : "green"}
                      onClick={() => {
                        setUserToAction(user);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      {user.activo ? (
                        <TrashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Formulario para agregar usuario */}
      <Card className="p-6 rounded-lg shadow-md bg-background">
        <Typography
          variant="h4"
          className="mb-4 text-xl font-semibold text-text"
        >
          Agregar Nuevo Usuario
        </Typography>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Typography variant="small" className="mb-1 font-medium">
              Nombre de Usuario
            </Typography>
            <Input
              type="text"
              placeholder="Usuario"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">
              Contraseña
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={newUser.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />
              <Button
                size="sm"
                variant="text"
                className="!absolute top-0 right-0 h-full bg-transparent text-text"
                disabled={!newUser.password}
                onClick={() =>
                  setShowPassword(!showPassword) && console.log(showPassword)
                }
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </Button>
            </div>
            {newUser.password && (
              <PasswordRequirements
                requirements={passwordValidation.requirements}
              />
            )}
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">
              Rol
            </Typography>
            <Select
              value={newUser.rol}
              onChange={(value) => setNewUser({ ...newUser, rol: value })}
            >
              {Object.entries(ROLES).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={loading || !passwordValidation.isValid}
          className="mt-4 bg-[var(--primary)]  text-background"
        >
          {loading ? "Procesando..." : "Registrar Usuario"}
        </Button>
      </Card>

      {/* Diálogo para eliminar/desactivar usuario */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>
          {userToAction?.activo ? "Desactivar Usuario" : "Activar Usuario"}
        </DialogHeader>
        <DialogBody>
          ¿Estás seguro que deseas{" "}
          {userToAction?.activo ? "desactivar" : "activar"} al usuario{" "}
          <span className="font-bold">{userToAction?.username}</span>?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button
            variant="gradient"
            color={userToAction?.activo ? "red" : "green"}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : userToAction?.activo
              ? "Desactivar"
              : "Activar"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Diálogo para cambiar contraseña */}
      <Dialog
        open={openChangePassDialog}
        handler={() => setOpenChangePassDialog(false)}
      >
        <DialogHeader>Cambiar Contraseña</DialogHeader>
        <DialogBody>
          <Typography className="mb-4">
            Nueva contraseña para{" "}
            <span className="font-bold">{userToAction?.username}</span>
          </Typography>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              label="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              required
            />
            <Button
              size="sm"
              variant="text"
              className="!absolute top-0 right-0 h-full bg-transparent text-text"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </Button>
          </div>
          {newPassword && (
            <PasswordRequirements
              requirements={passwordValidation.requirements}
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => {
              setOpenChangePassDialog(false);
              setNewPassword("");
              setPasswordValidation({
                isValid: false,
                requirements: {
                  length: false,
                  hasUpperCase: false,
                  hasLowerCase: false,
                  hasNumber: false,
                  hasSymbol: false,
                },
                missingRequirements: [],
              });
            }}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleChangePassword}
            disabled={loading || !newPassword || !passwordValidation.isValid}
          >
            {loading ? "Procesando..." : "Cambiar Contraseña"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Diálogo para cambiar rol */}
      <Dialog
        open={openChangeRoleDialog}
        handler={() => setOpenChangeRoleDialog(false)}
      >
        <DialogHeader>Cambiar Rol de Usuario</DialogHeader>
        <DialogBody>
          <Typography className="mb-4">
            Selecciona el nuevo rol para{" "}
            <span className="font-bold">{userToAction?.username}</span>
          </Typography>
          <div className="flex gap-2">
            {Object.entries(ROLES).map(([key, value]) => (
              <Button
                key={key}
                variant={userToAction?.rol === key ? "filled" : "outlined"}
                color="blue"
                onClick={() => handleChangeRole(key)}
                disabled={loading || userToAction?.rol === key}
              >
                {value}
              </Button>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenChangeRoleDialog(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Usuarios;
