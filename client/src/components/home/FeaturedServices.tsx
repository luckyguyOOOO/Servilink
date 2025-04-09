import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/services/ServiceCard";

interface FeaturedServicesProps {
  services: any[];
  isLoading: boolean;
}

export default function FeaturedServices({ services, isLoading }: FeaturedServicesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil((services?.length || 0) / itemsPerSlide);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const currentServices = services?.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
              Servicios destacados
            </h2>
            <p className="text-gray-600 mt-1">Profesionales con las mejores valoraciones</p>
          </div>

          <div className="flex space-x-2">
            <button
              className="rounded-full p-2 border border-gray-300 text-gray-500 hover:text-primary-600 hover:border-primary-600"
              onClick={handlePrevious}
              disabled={isLoading || totalSlides <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="rounded-full p-2 border border-gray-300 text-gray-500 hover:text-primary-600 hover:border-primary-600"
              onClick={handleNext}
              disabled={isLoading || totalSlides <= 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentServices?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => setLocation("/servicios")}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Ver todos los servicios
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
