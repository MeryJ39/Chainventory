import { Typography } from "@material-tailwind/react";
import { FaCow } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full p-8 bg-background text-text">
      <div className="flex flex-row flex-wrap items-center justify-center text-center gap-y-6 gap-x-12 md:justify-between">
        <FaCow className="w-12 h-12 text-text" />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          {["About Us", "License", "Contribute", "Contact Us"].map((item) => (
            <li key={item}>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors text-text hover:text-primary focus:text-primary"
              >
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <hr className="my-8 border-text opacity-30" />
      <Typography className="font-normal text-center text-text">
        &copy; 2025 MER - Todos los derechos reservados.
      </Typography>
    </footer>
  );
};

export default Footer;
