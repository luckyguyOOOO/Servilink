import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SearchFormProps {
  onSearch: (formData: any) => void;
  categories: any[];
  initialValues: any;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, categories, initialValues, isLoading }: SearchFormProps) {
  const [formData, setFormData] = useState({
    categoria: initialValues.categoria || "",
    subcategoria: initialValues.subcategoria || "",
    ubicacion: initialValues.ubicacion || "",
    search: initialValues.search || "",
    precioMin: initialValues.precioMin || "",
    precioMax: initialValues.precioMax || "",
    orden: initialValues.orden || "reciente",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleReset = () => {
    setFormData({
      categoria: "",
      subcategoria: "",
      ubicacion: "",
      search: "",
      precioMin: "",
      precioMax: "",
      orden: "reciente",
    });
    onSearch({
      categoria: "",
      subcategoria: "",
      ubicacion: "",
      search: "",
      precioMin: "",
      precioMax: "",
      orden: "reciente",
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="text"
              name="search"
              placeholder="Buscar servicios..."
              value={formData.search}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={toggleFilters}
              className="md:w-auto w-full flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button type="submit" className="md:w-auto w-full flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger>Filtros avanzados</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
                        disabled={isLoading}
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategoría
                      </label>
                      <Input
                        type="text"
                        name="subcategoria"
                        placeholder="Subcategoría"
                        value={formData.subcategoria}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación
                      </label>
                      <Input
                        type="text"
                        name="ubicacion"
                        placeholder="Ciudad, país"
                        value={formData.ubicacion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio mínimo (€)
                      </label>
                      <Input
                        type="number"
                        name="precioMin"
                        placeholder="Desde"
                        value={formData.precioMin}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio máximo (€)
                      </label>
                      <Input
                        type="number"
                        name="precioMax"
                        placeholder="Hasta"
                        value={formData.precioMax}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </form>
    </div>
  );
}
