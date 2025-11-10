import {
  Button,
  Typography,
  Chip,
  Card,
  CardBody,
} from "@material-tailwind/react";
import {
  BriefcaseIcon,
  UserGroupIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ChartBarIcon,
  PhoneIcon, 
} from "@heroicons/react/24/solid";
import mainBanner from "../assets/banner2.jpeg";

const Home = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      title: "Genética Superior",
      description:
        "Animales con pedigrí certificado y características genéticas sobresalientes para optimizar su producción ganadera.",
    },
    {
      icon: <HeartIcon className="w-12 h-12" />,
      title: "Sanidad Garantizada",
      description:
        "Bovinos criados con estrictos protocolos sanitarios y certificaciones veterinarias vigentes.",
    },
    {
      icon: <UserGroupIcon className="w-12 h-12" />,
      title: "Manejo Profesional",
      description:
        "Equipo técnico especializado con años de experiencia en manejo y bienestar animal.",
    },
    {
      icon: <ChartBarIcon className="w-12 h-12" />,
      title: "Productividad Comprobada",
      description:
        "Registros genealógicos y de producción que respaldan la calidad de nuestros ejemplares.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Contacto Inicial",
      description:
        "Establezca comunicación con nuestro equipo comercial para conocer disponibilidad y características del ganado.",
    },
    {
      number: "02",
      title: "Evaluación y Selección",
      description:
        "Nuestros especialistas le asesorarán en la selección de ejemplares según sus requerimientos específicos.",
    },
    {
      number: "03",
      title: "Cotización Formal",
      description:
        "Reciba una propuesta comercial detallada con información completa de los animales y condiciones de venta.",
    },
    {
      number: "04",
      title: "Logística y Entrega",
      description:
        "Coordinamos el transporte certificado y la entrega con toda la documentación requerida.",
    },
  ];

  const stats = [
    { value: "15+", label: "Años de Experiencia" },
    { value: "2,500+", label: "Bovinos Comercializados" },
    { value: "98%", label: "Satisfacción del Cliente" },
    { value: "100%", label: "Certificación Sanitaria" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${mainBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40">
          <div className="container flex flex-col justify-center h-full px-6 mx-auto md:px-12 lg:px-24">
            <div className="max-w-3xl">
              <Chip
                value="Calidad Certificada"
                className="mb-6 font-semibold bg-secondary text-background"
              />
              <Typography
                variant="h1"
                className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
              >
                Sistema Profesional de Gestión Ganadera
              </Typography>
              <Typography
                variant="lead"
                className="mb-8 text-lg font-light leading-relaxed text-white/90 md:text-xl"
              >
                Comercialización de bovinos de alta genética con respaldo
                técnico y sanitario. Compromiso con la excelencia en cada etapa
                del proceso.
              </Typography>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="flex items-center gap-3 bg-secondary text-background"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Solicitar Información
                </Button>
                <Button
                  size="lg"
                  variant="outlined"
                  className="flex items-center gap-3 text-white border-white hover:bg-white/10"
                >
                  <BriefcaseIcon className="w-5 h-5" />
                  Ver Catálogo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20">
        <div className="container px-6 mx-auto md:px-12 lg:px-24">
          <Card className="shadow-2xl bg-background">
            <CardBody className="p-8">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <Typography
                      variant="h2"
                      className="mb-2 text-4xl font-bold text-primary"
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-semibold tracking-wider uppercase text-text/70"
                    >
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container px-6 mx-auto md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <Typography
              variant="small"
              className="mb-3 font-bold tracking-widest uppercase text-primary"
            >
              Nuestra Empresa
            </Typography>
            <Typography
              variant="h2"
              className="mb-6 text-4xl font-bold text-text"
            >
              Excelencia en Ganadería Bovina
            </Typography>
            <Typography
              variant="paragraph"
              className="text-lg leading-relaxed text-text/80"
            >
              Empresa especializada en la cría, selección y comercialización de
              bovinos de élite. Contamos con infraestructura de vanguardia,
              equipo técnico calificado y un riguroso programa de mejoramiento
              genético que garantiza animales de superior calidad productiva y
              reproductiva.
            </Typography>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="transition-all duration-300 border shadow-md hover:shadow-xl hover:-translate-y-2 border-text/10 bg-background"
              >
                <CardBody className="p-8 text-center">
                  <div className="flex justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <Typography variant="h5" className="mb-3 font-bold text-text">
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="leading-relaxed text-text/70"
                  >
                    {feature.description}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-text/10"></div>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container px-6 mx-auto md:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <Typography
              variant="small"
              className="mb-3 font-bold tracking-widest uppercase text-primary"
            >
              Proceso de Adquisición
            </Typography>
            <Typography variant="h2" className="text-4xl font-bold text-text">
              Metodología Profesional en 4 Etapas
            </Typography>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transition-all duration-300 border shadow-lg hover:shadow-2xl border-text/10 bg-background"
                >
                  <CardBody className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                          <Typography
                            variant="h4"
                            className="font-bold text-background"
                          >
                            {step.number}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Typography
                          variant="h5"
                          className="mb-3 font-bold text-text"
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="paragraph"
                          className="leading-relaxed text-text/70"
                        >
                          {step.description}
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-accent text-background">
        <div className="container px-6 mx-auto md:px-12">
          <div className="max-w-3xl mx-auto">
            <BriefcaseIcon className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <Typography variant="h2" className="mb-4 text-4xl font-bold">
              Invierta en Genética de Excelencia
            </Typography>
            <Typography
              variant="lead"
              className="mb-8 text-lg leading-relaxed opacity-90"
            >
              Nuestro equipo técnico está disponible para asesorarlo en la
              selección de bovinos que maximicen la rentabilidad de su operación
              ganadera.
            </Typography>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="flex items-center justify-center gap-3 bg-background text-accent"
              >
                <PhoneIcon className="w-5 h-5" />
                Contactar Ahora
              </Button>
              <Button
                size="lg"
                variant="outlined"
                className="flex items-center justify-center gap-3 border-2 text-background border-background hover:bg-background/10"
              >
                <TruckIcon className="w-5 h-5" />
                Solicitar Cotización
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
