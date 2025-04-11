// components/Fallback.jsx (o el nombre que prefieras)

const Fallback = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      {" "}
      {/* Centra vertical y horizontalmente */}
      <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>{" "}
      {/* Spinner */}
      <p className="ml-4 text-lg font-medium text-gray-700">Cargando...</p>{" "}
      {/* Mensaje */}
    </div>
  );
};

export default Fallback;
