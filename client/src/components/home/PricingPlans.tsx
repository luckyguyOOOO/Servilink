import { Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Pricing plans data
const plans = [
  {
    id: "basic",
    name: "Básico",
    description: "Para empezar a explorar",
    price: "Gratis",
    isPeriod: false,
    isPopular: false,
    features: [
      { text: "Hasta 5 contactos con profesionales", included: true },
      { text: "Perfil básico", included: true },
      { text: "Búsqueda básica", included: true },
      { text: "Posicionamiento destacado", included: false },
      { text: "Soporte prioritario", included: false }
    ]
  },
  {
    id: "professional",
    name: "Profesional",
    description: "Ideal para usuarios frecuentes",
    price: "€19.99",
    isPeriod: true,
    isPopular: true,
    features: [
      { text: "Contactos ilimitados", included: true },
      { text: "Perfil destacado", included: true },
      { text: "Búsqueda avanzada", included: true },
      { text: "Posicionamiento destacado", included: true },
      { text: "Soporte prioritario", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Para proveedores profesionales",
    price: "€39.99",
    isPeriod: true,
    isPopular: false,
    features: [
      { text: "Todo lo del plan Profesional", included: true },
      { text: "Publicidad destacada", included: true },
      { text: "Estadísticas avanzadas", included: true },
      { text: "Hasta 20 imágenes por servicio", included: true },
      { text: "Soporte prioritario", included: true }
    ]
  }
];

export default function PricingPlans() {
  const [, setLocation] = useLocation();

  return (
    <section id="planes" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
            Planes para cada necesidad
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a ti, ya sea como cliente o proveedor de servicios
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${
                plan.isPopular
                  ? "bg-white rounded-xl overflow-hidden shadow-lg border-2 border-primary-500 transform md:-translate-y-4 relative"
                  : "bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 inset-x-0">
                  <div className="bg-primary-500 text-white text-xs font-bold uppercase tracking-wide text-center py-1">
                    Más popular
                  </div>
                </div>
              )}
              <div className={`p-6 border-b ${plan.isPopular ? "mt-5" : ""}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.isPeriod && <span className="text-gray-500">/mes</span>}
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-gray-600" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    onClick={() => setLocation("/auth")}
                    variant={plan.isPopular ? "default" : "outline"}
                    className={`w-full ${
                      plan.isPopular
                        ? "bg-primary-600 hover:bg-primary-700"
                        : "border-primary-600 text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    Elegir plan
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
