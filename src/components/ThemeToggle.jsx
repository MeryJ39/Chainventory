import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";

const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  return (
    <Button
      onClick={themeContext.toggleTheme}
      variant="text"
      className="w-8 h-8 p-2 transition-colors delay-300 rounded-lg text-text bg-backgroud"
    >
      {themeContext.theme === "dark" ? (
        <SunIcon></SunIcon>
      ) : (
        <MoonIcon></MoonIcon>
      )}
    </Button>
  );
};

export default ThemeToggle;
