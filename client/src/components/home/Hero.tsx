import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationValue, setLocationInput] = useState("");

  // Fetch categories
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categorias"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (selectedCategory) params.append("categoria", selectedCategory);
    if (locationValue) params.append("ubicacion", locationValue);
    
    setLocation(`/servicios?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Conecta con los mejores profesionales
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Encuentra especialistas para cualquier servicio que necesites, compara y contacta de forma segura.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">¿Qué servicio buscas?</option>
                    {Array.isArray(categories) && categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="¿Dónde lo necesitas?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={locationValue}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 h-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-blue-200">
              <p>
                Los servicios más buscados:{" "}
                <a href="/servicios?search=Limpieza del hogar" className="underline hover:text-white">
                  Limpieza del hogar
                </a>
                ,{" "}
                <a href="/servicios?categoria=reparaciones" className="underline hover:text-white">
                  Reparaciones
                </a>
                ,{" "}
                <a href="/servicios?search=Cuidado de mascotas" className="underline hover:text-white">
                  Cuidado de mascotas
                </a>
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white p-2 rounded-lg shadow-xl">
              <svg className="w-full h-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="400" fill="#f8fafc" />
                <circle cx="300" cy="200" r="150" fill="#eff6ff" />
                <path d="M200,150 Q300,50 400,150 T500,250 T300,350 T100,250 T200,150" fill="#dbeafe" />
                <circle cx="250" cy="180" r="50" fill="#93c5fd" />
                <circle cx="360" cy="220" r="70" fill="#60a5fa" />
                <path d="M150,320 C200,290 400,290 450,320" stroke="#2563eb" strokeWidth="6" fill="none" />
                <path d="M280,200 L320,200 L320,240 L280,240 Z" fill="#1d4ed8" />
                <path d="M220,160 L260,160 L260,200 L220,200 Z" fill="#1e40af" />
                <path d="M330,230 L370,230 L370,270 L330,270 Z" fill="#1e3a8a" />
                <circle cx="240" cy="180" r="8" fill="#f97316" />
                <circle cx="350" cy="250" r="8" fill="#f97316" />
                <path d="M100,300 L150,280 L200,285 L250,270 L300,280 L350,270 L400,290 L450,270 L500,290" stroke="#bfdbfe" strokeWidth="4" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
