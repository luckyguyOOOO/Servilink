import { Search, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  return (
    <section id="como-funciona" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
            ¿Cómo funciona Servilink?
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Conectar con profesionales de calidad nunca ha sido tan fácil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Busca un servicio</h3>
            <p className="text-gray-600">
              Explora entre cientos de servicios profesionales o utiliza nuestros filtros para encontrar exactamente lo que necesitas.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Contacta al profesional</h3>
            <p className="text-gray-600">
              Habla directamente con el profesional, explica tus necesidades y solicita un presupuesto personalizado.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Recibe el servicio</h3>
            <p className="text-gray-600">
              Una vez acordados los detalles, el profesional realizará el trabajo según lo pactado. ¡Luego puedes valorar su servicio!
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button 
            onClick={() => setLocation("/servicios")}
            className="bg-secondary-500 hover:bg-secondary-600 text-white px-5 py-3 h-auto"
          >
            Comenzar ahora
          </Button>
        </div>
      </div>
    </section>
  );
}
