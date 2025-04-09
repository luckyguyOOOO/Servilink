import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTA() {
  const [, setLocation] = useLocation();

  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4">
            ¿Listo para mejorar tu vida o negocio?
          </h2>
          <p className="text-primary-100 mb-8">
            Únete a miles de personas que ya confían en Servilink para encontrar los mejores profesionales o para ofrecer sus servicios.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => setLocation("/servicios")}
              variant="outline" 
              className="px-6 py-3 h-auto bg-white text-primary-700 hover:bg-gray-100 border-none"
            >
              Buscar un servicio
            </Button>
            <Button
              onClick={() => setLocation("/auth")}
              className="px-6 py-3 h-auto bg-secondary-500 text-white hover:bg-secondary-600 border-none"
            >
              Ofrecer mis servicios
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
