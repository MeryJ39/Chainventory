import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { AuthContext } from "../context/authContext";
import {
  ChevronDownIcon,
  PowerIcon,
  UserCircleIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import Avvvatars from "avvvatars-react";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

const profileMenuItems = [
  { label: "Mi perfil", icon: UserCircleIcon, link: "dashboard/profile" },
  { label: "Inbox", icon: InboxArrowDownIcon, link: "dashboard/inbox" },
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/";
  }, [user]);

  return (
    <div className="flex flex-col h-screen transition-colors delay-300 bg-background">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-2 transition-colors delay-300 shadow-lg bg-background">
        <Sidebar />

        <div className="flex items-center gap-4">
          <Typography
            variant="small"
            className="font-medium transition-colors delay-300 text-text"
          >
            {user?.username || "Cargando..."}
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
                  value={user?.email || "user@gmail.com"}
                  className="w-full h-full"
                  style="character"
                  shadow
                />
                <ChevronDownIcon
                  className={`h-3 w-3 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
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
              <MenuItem
                onClick={logout}
                className="flex items-center gap-2 rounded hover:bg-red-500/10"
              >
                <PowerIcon className="w-4 h-4 text-red-500" />
                <Typography as="span" variant="small" color="red">
                  Sign out
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 bg-background overflow-auto max-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
