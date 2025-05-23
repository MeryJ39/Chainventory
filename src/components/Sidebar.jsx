import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  RectangleStackIcon,
  ArrowsRightLeftIcon,
  Square3Stack3DIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { FaCow } from "react-icons/fa6";
import ThemeSwitch from "./ThemeSwitch";
import { GiCow } from "react-icons/gi";

export function SidebarWithBurgerMenu() {
  const [open, setOpen] = React.useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  //funciona para mandar al usuario a cierta pagina
  const navigate = useNavigate();
  const handleNavigate = (route) => {
    navigate(`/${route}`);
  };

  return (
    <>
      <IconButton variant="text" size="md" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="w-8 h-8 stroke-2 text-text" />
        ) : (
          <Bars3Icon className="w-8 h-8 stroke-2 text-text" />
        )}
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        className=" bg-background"
      >
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="flex items-center gap-4 p-4 mb-2 ">
            <FaCow className="w-8 h-8 text-text" />
            <Typography
              variant="h5"
              className=" text-text"
              onClick={() => handleNavigate("")}
            >
              Inventario Bovino
            </Typography>
          </div>

          <List className=" text-text">
            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4  text-text     ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0 " selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="p-3 border-b-0 text-text"
                >
                  <ListItemPrefix>
                    <PresentationChartBarIcon className="w-5 h-5 " />
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal ">
                    Dashboard
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1 ">
                <List className="p-0 text-text ">
                  <ListItem onClick={() => handleNavigate("dashboard")}>
                    <ListItemPrefix>
                      <ChartPieIcon strokeWidth={3} className="w-5 h-3 " />
                    </ListItemPrefix>
                    Analíticas
                  </ListItem>
                  <ListItem
                    onClick={() => handleNavigate("dashboard/informes")}
                  >
                    <ListItemPrefix>
                      <DocumentChartBarIcon
                        strokeWidth={3}
                        className="w-5 h-3"
                      />
                    </ListItemPrefix>
                    Informes
                  </ListItem>
                  <ListItem
                    onClick={() => handleNavigate("dashboard/auditorias")}
                  >
                    <ListItemPrefix>
                      <MagnifyingGlassIcon
                        strokeWidth={3}
                        className="w-5 h-3"
                      />
                    </ListItemPrefix>
                    Auditorias
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 text-text   ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0 " selected={open === 2}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="p-3 border-b-0 text-text"
                >
                  <ListItemPrefix>
                    <Square3Stack3DIcon className="w-5 h-5" />
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal ">
                    Inventario
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1 ">
                <List className="p-0 text-text">
                  <ListItem
                    onClick={() => handleNavigate("dashboard/animales")}
                  >
                    <ListItemPrefix>
                      <GiCow strokeWidth={3} className="w-5 h-5" />
                    </ListItemPrefix>
                    Animales
                  </ListItem>
                  <ListItem
                    onClick={() => handleNavigate("dashboard/productos")}
                  >
                    <ListItemPrefix>
                      <RectangleStackIcon strokeWidth={3} className="w-5 h-5" />
                    </ListItemPrefix>
                    Productos
                  </ListItem>
                  <ListItem onClick={() => handleNavigate("dashboard/ventas")}>
                    <ListItemPrefix>
                      <ArrowsRightLeftIcon
                        strokeWidth={3}
                        className="w-5 h-5"
                      />
                    </ListItemPrefix>
                    Ventas
                  </ListItem>
                  <ListItem
                    onClick={() => handleNavigate("dashboard/vacunaciones")}
                  >
                    <ListItemPrefix>
                      <PencilSquareIcon strokeWidth={3} className="w-5 h-5" />
                    </ListItemPrefix>
                    Vacunaciones
                  </ListItem>
                  <ListItem
                    onClick={() => handleNavigate("dashboard/usuarios")}
                  >
                    <ListItemPrefix>
                      <UserIcon strokeWidth={3} className="w-5 h-5" />
                    </ListItemPrefix>
                    Usuarios
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            <hr className="my-2 border-text" />
            <ListItem>
              <ListItemPrefix>
                <ArrowPathIcon className="w-5 h-5" />
              </ListItemPrefix>
              Theme
              <ListItemSuffix>
                <ThemeSwitch />
              </ListItemSuffix>
            </ListItem>

            <ListItem onClick={() => handleNavigate("dashboard/profile")}>
              <ListItemPrefix>
                <UserCircleIcon className="w-5 h-5" />
              </ListItemPrefix>
              Perfil
            </ListItem>

            <ListItem>
              <ListItemPrefix>
                <PowerIcon className="w-5 h-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}

export default SidebarWithBurgerMenu;
