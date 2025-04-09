import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocationInput] = useState("");

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categorias"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (selectedCategory) params.append("categoria", selectedCategory);
    if (location) params.append("ubicacion", location);
    
    setLocation(`/servicios?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Conecta con los mejores profesionales
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Encuentra especialistas para cualquier servicio que necesites, compara y contacta de forma segura.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">¿Qué servicio buscas?</option>
                    {categories?.map((category: any) => (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={location}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 h-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-primary-200">
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
            <img
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80"
              alt="Profesionales brindando servicios"
              className="rounded-lg shadow-xl"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
