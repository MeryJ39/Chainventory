// components/Fallback.jsx (o el nombre que prefieras)
import React from "react";

const Fallback = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      {" "}
      {/* Centra vertical y horizontalmente */}
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>{" "}
      {/* Spinner */}
      <p className="ml-4 text-lg font-medium text-gray-700">Cargando...</p>{" "}
      {/* Mensaje */}
    </div>
  );
};

export default Fallback;
