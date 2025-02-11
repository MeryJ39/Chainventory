import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Switch } from "@material-tailwind/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ThemeSwitch = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { theme, toggleTheme } = themeContext;

  return (
    <div className="flex items-center gap-2">
      {/* Ícono del sol cuando está en modo claro */}
      <SunIcon
        className={`w-5 h-5 ${
          theme === "dark" ? "text-gray-400" : "text-yellow-400"
        }`}
      />

      {/* Switch sin children */}
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="cursor-pointer"
        aria-label="Toggle Dark Mode"
      />

      {/* Ícono de la luna cuando está en modo oscuro */}
      <MoonIcon
        className={`w-5 h-5 ${
          theme === "dark" ? "text-blue-400" : "text-gray-400"
        }`}
      />
    </div>
  );
};

export default ThemeSwitch;
