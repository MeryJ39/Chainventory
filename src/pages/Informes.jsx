// Informes.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const Informes = () => {
  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Informes
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Contenido de la página de informes */}
        <Typography variant="h5" color="blue" className="mb-4">
          Aquí se generarán los informes del inventario.
        </Typography>
        {/* Puedes agregar opciones para generar diferentes tipos de informes. */}
      </CardBody>
    </Card>
  );
};

export default Informes;
