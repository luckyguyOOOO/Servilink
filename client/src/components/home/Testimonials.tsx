import { Star } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    text: "Encontré un electricista excelente en menos de una hora. El trabajo quedó perfecto y el precio fue mucho más económico de lo que esperaba. Sin duda volveré a usar Servilink.",
    author: "Laura Gómez",
    role: "Cliente desde 2021",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5
  },
  {
    id: 2,
    text: "Como profesional de la limpieza, Servilink me ha permitido conseguir nuevos clientes de forma constante. La plataforma es muy intuitiva y el soporte al usuario es excelente.",
    author: "David Hernández",
    role: "Proveedor desde 2020",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5
  },
  {
    id: 3,
    text: "Necesitaba urgentemente un fontanero un domingo por la tarde. En Servilink encontré varios disponibles y en menos de dos horas tenía mi problema resuelto. Increíble servicio.",
    author: "Patricia Torres",
    role: "Cliente desde 2022",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80",
    rating: 4
  }
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-gray-600 mt-2">
            Miles de personas han encontrado el profesional perfecto en Servilink
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={`Avatar de ${testimonial.author}`}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
