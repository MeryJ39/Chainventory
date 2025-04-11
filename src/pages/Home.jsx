import { Button, Typography, Chip } from "@material-tailwind/react";
import {
  BriefcaseIcon,
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/solid"; // Importa los iconos
import mainBanner from "../assets/banner1.jpg"; // Importa la imagen local (ajusta la ruta)

const Home = () => {
  console.log("mainBanner URL:", mainBanner); // Comprueba la URL en la consola

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[calc(100vh-55px)] bg-cover bg-center"
        style={{ backgroundImage: `url(${mainBanner})` }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-12 bg-black/50">
          {" "}
          {/* Overlay y centrado */}
          <div className="text-center text-white">
            <Typography variant="h3" className="mb-6 text-4xl font-extrabold">
              Bovinos de calidad superior para su negocio ganadero
            </Typography>
            <Typography variant="paragraph" className="mb-8 text-lg font-light">
              Genética selecta, manejo experto y tradición ganadera a su
              servicio.
            </Typography>
            <Button className="mb-4 bg-background text-text">
              Contáctenos para conocer nuestro catálogo
            </Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-12 bg-background bg-[url('/path/to/your/texture.jpg')] bg-cover bg-center bg-fixed">
        {" "}
        {/* Ajustes de estilos */}
        <div className="container mx-auto">
          {" "}
          {/* Contenedor centrado */}
          <Typography
            variant="h4"
            className="mb-4 font-bold text-center text-text"
          >
            {" "}
            {/* Título */}
            Nuestra pasión: la ganadería de excelencia
          </Typography>
          <div className="max-w-3xl mx-auto text-center text-text">
            {" "}
            {/* Contenedor de texto */}
            <Typography>
              Somos una empresa ganadera con [número] años de experiencia en la
              cría y selección de bovinos de las mejores razas. Nuestro
              compromiso es ofrecer animales de alta calidad genética, sanos y
              productivos, que impulsen el éxito de su negocio.
            </Typography>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 bg-text">
        <div className="container mx-auto">
          <Typography
            variant="h4"
            className="mb-8 font-bold text-center text-background"
          >
            Nuestros bovinos: calidad y productividad garantizada
          </Typography>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <Typography
                variant="h6"
                className="mb-2 font-bold text-background"
              >
                Genética superior
              </Typography>
              <Typography className="text-background">
                Animales con pedigrí y características genéticas sobresalientes.
              </Typography>
            </div>
            <div className="text-center">
              <HeartIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <Typography
                variant="h6"
                className="mb-2 font-bold text-background"
              >
                Sanidad y bienestar
              </Typography>
              <Typography className="text-background">
                {" "}
                Bovinos criados en un entorno natural, con estrictos controles
                sanitarios.
              </Typography>
            </div>
            <div className="text-center">
              <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <Typography
                variant="h6"
                className="mb-2 font-bold text-background"
              >
                Manejo profesional
              </Typography>
              <Typography className="text-background">
                Cuidado integral de los animales por expertos en ganadería.
              </Typography>
            </div>
            {/* ... (Más características) */}
          </div>
        </div>
      </section>

      <section className="w-full p-10 bg-background">
        {" "}
        {/* Intercambiado bg-gray-800 y dark:bg-transparent */}
        <Typography
          variant="h4"
          className="mb-4 font-bold text-center text-text" /* Intercambiado text-white y dark:text-gray-900 */
        >
          Adquiera sus bovinos en 4 sencillos pasos
        </Typography>
        <div className="grid grid-cols-1 gap-8 text-text md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center text-text">
            {" "}
            {/* Intercambiado text-white y dark:text-gray-900 */}
            <Chip
              variant="filled"
              color="blue"
              value="1"
              className="mb-4 text-text bg-secondary " /* Intercambiado bg-blue-700 y dark:bg-blue-500 */
            />
            <Typography variant="h6" className="mb-2 font-bold">
              Contacto
            </Typography>
            <Typography className="">
              {" "}
              {/* Intercambiado text-gray-300 y dark:text-gray-700 */}
              Comuníquese con nosotros para conocer nuestro catálogo.
            </Typography>
          </div>

          <div className="text-center ">
            <Chip
              variant="filled"
              color="blue"
              value="2"
              className="mb-4 text-text bg-secondary " /* Intercambiado bg-blue-700 y dark:bg-blue-500 */
            />
            <Typography variant="h6" className="mb-2 font-bold">
              Selección
            </Typography>
            <Typography className="">
              Escoja los bovinos que mejor se adapten a sus necesidades.
            </Typography>
          </div>

          <div className="text-center ">
            <Chip
              variant="filled"
              color="blue"
              value="3"
              className="mb-4 text-text bg-secondary " /* Intercambiado bg-blue-700 y dark:bg-blue-500 */
            />
            <Typography variant="h6" className="mb-2 font-bold">
              Cotización
            </Typography>
            <Typography className="">
              Reciba una cotización detallada de los animales seleccionados.
            </Typography>
          </div>

          <div className="text-center ">
            <Chip
              variant="filled"
              color="blue"
              value="4"
              className="mb-4 text-text bg-secondary " /* Intercambiado bg-blue-700 y dark:bg-blue-500 */
            />
            <Typography variant="h6" className="mb-2 font-bold">
              Entrega
            </Typography>
            <Typography className="">
              Coordinamos la entrega de los bovinos a su destino.
            </Typography>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center bg-accent text-background">
        <Typography variant="h4" className="mb-4 font-bold">
          ¿Listo para invertir en genética bovina de primer nivel?
        </Typography>
        <Button color="white">¡Contáctenos hoy mismo!</Button>
      </section>
    </div>
  );
};

export default Home;
