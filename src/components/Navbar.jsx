import React, { useState, useEffect } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const NavbarComponent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {["home", "inventario", "profile"].map((route) => (
        <Typography
          key={route}
          as="li"
          variant="small"
          className="p-1 font-normal transition-colors delay-300 text-text"
        >
          <Link
            to={`/${route}`}
            className="flex items-center hover:text-primary"
          >
            {route.charAt(0).toUpperCase() + route.slice(1)}
          </Link>
        </Typography>
      ))}
      <ThemeToggle />
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 max-w-full px-4 py-2 transition-colors delay-300 border-0 rounded-none dark:bg-background h-max lg:px-8 lg:py-4">
      <div className="flex items-center justify-between ">
        <Typography
          as={Link}
          to="/"
          className="mr-4 cursor-pointer py-1.5 font-medium text-text transition-colors delay-300"
        >
          Inventario Bovino
        </Typography>

        <div className="flex items-center gap-4">
          <div className="hidden mr-4 lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button variant="text" size="sm" className="hidden lg:inline-block">
              <Link
                to="/login"
                className="transition-colors delay-300 text-text hover:text-primary"
              >
                Log In
              </Link>
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <Link to="/register" className="text-white">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Botón de menú hamburguesa */}
          <IconButton
            variant="text"
            className="w-6 h-6 ml-auto text-text lg:hidden"
            ripple={false}
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      <Collapse open={open}>
        <div className="flex flex-col items-start gap-4">{navList}</div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <Button fullWidth variant="text" size="sm">
            <Link to="/login" className="text-text hover:text-primary">
              Log In
            </Link>
          </Button>
          <Button fullWidth variant="gradient" size="sm">
            <Link to="/register" className="text-white">
              Sign Ino
            </Link>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
