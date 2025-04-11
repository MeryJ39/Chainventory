import { useState, useEffect } from "react";
import {
  Navbar,
  Typography,
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
          className="p-1 font-normal text-text"
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
    <Navbar className="sticky top-0 z-10 max-w-full px-4 py-2 border-0 rounded-none dark:bg-background h-max lg:px-8 lg:py-4">
      <div className="flex items-center justify-between ">
        <Typography
          as={Link}
          to="/"
          className="mr-4 cursor-pointer py-1.5 font-medium text-text     "
        >
          Inventario Bovino
        </Typography>

        <div className="flex items-center gap-4">
          <div className="hidden mr-4 lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Link
              to="/login"
              className="hidden px-4 py-2 transition-colors duration-300 rounded-md lg:inline-block text-text hover:text-primary" // Añadí px-4 py-2 rounded-md y transition-colors
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="hidden px-4 py-2 transition-colors duration-300 rounded-md text-text lg:inline-block bg-gradient-to-r from-secondary to-primary" // Añadí bg-gradient-to-r y px-4 py-2 rounded-md y transition-colors
            >
              Sign In
            </Link>
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
          <Link
            to="/login"
            className="w-full px-4 py-2 text-center transition-colors duration-300 rounded-md text-text hover:text-primary"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="w-full px-4 py-2 text-center transition-colors duration-300 rounded-md text-text bg-gradient-to-r from-secondary to-accent"
          >
            Sign In
          </Link>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
