// Auditorias.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const Auditorias = () => {
  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Auditorías
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Contenido de la página de auditorías */}
        <Typography variant="h5" color="blue" className="mb-4">
          Aquí se mostrarán los registros de auditoría.
        </Typography>
        {/* Puedes agregar una tabla con los registros de auditoría. */}
      </CardBody>
    </Card>
  );
};

export default Auditorias;
