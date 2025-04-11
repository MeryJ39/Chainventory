import React, { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext"; // 🔥 Importamos el contexto de autenticación
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Avvvatars from "avvvatars-react";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

const profileMenuItems = [
  { label: "Mi perfil", icon: UserCircleIcon, link: "dashboard/profile" },
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // 🔥 Obtenemos el usuario y la función de logout
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // 🔥 Cerramos sesión
    navigate("/"); // 🔥 Redirigimos al home
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-accent bg-background">
        <Sidebar />

        <div className="flex items-center gap-4">
          {/* 🔥 Mostrar nombre del usuario autenticado */}
          <Typography variant="small" className="font-medium text-text">
            {user ? user.username : "Invitado"}
          </Typography>

          <ThemeToggle />

          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5"
              >
                <Avvvatars
                  value={user ? user.username : "guest@example.com"}
                  className="w-full h-full"
                  style="character"
                  shadow
                />
                <ChevronDownIcon
                  className={`h-3 w-3   ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </MenuHandler>
            <MenuList className="p-1 bg-background">
              {profileMenuItems.map(({ label, icon, link }) => (
                <MenuItem
                  key={label}
                  onClick={() => navigate(`/${link}`)}
                  className="flex items-center gap-2 rounded text-text"
                >
                  {React.createElement(icon, {
                    className: "h-4 w-4 text-text",
                    strokeWidth: 2,
                  })}
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal text-text"
                  >
                    {label}
                  </Typography>
                </MenuItem>
              ))}

              {/* 🔥 Botón para cerrar sesión */}
              <MenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 rounded hover:bg-red-500/10"
              >
                <PowerIcon className="w-4 h-4 text-red-500" />
                <Typography as="span" variant="small" color="red">
                  Cerrar sesión
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 max-h-screen overflow-auto bg-background">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
