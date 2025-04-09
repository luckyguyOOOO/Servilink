import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/services/SearchForm";
import ServiceCard from "@/components/services/ServiceCard";
import { Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useState({
    categoria: "",
    subcategoria: "",
    ubicacion: "",
    search: "",
    orden: "reciente",
    precioMin: "",
    precioMax: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categorias"],
  });

  // Build query string from search params
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchParams.categoria) params.append("categoria", searchParams.categoria);
    if (searchParams.subcategoria) params.append("subcategoria", searchParams.subcategoria);
    if (searchParams.ubicacion) params.append("ubicacion", searchParams.ubicacion);
    if (searchParams.search) params.append("search", searchParams.search);
    if (searchParams.orden) params.append("orden", searchParams.orden);
    if (searchParams.precioMin) params.append("precioMin", searchParams.precioMin);
    if (searchParams.precioMax) params.append("precioMax", searchParams.precioMax);
    return params.toString();
  };

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: [`/api/servicios?${buildQueryString()}`],
  });

  // Handle search form submit
  const handleSearch = (formData: any) => {
    setSearchParams(formData);
    setCurrentPage(1);
  };

  // Paginate services
  const paginateServices = (items: any[]) => {
    if (!items) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = services ? Math.ceil(services.length / itemsPerPage) : 0;
  const paginatedServices = paginateServices(services);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins mb-2">Buscar Servicios</h1>
            <p className="text-gray-600">Encuentra el servicio que necesitas entre nuestra amplia selección</p>
          </div>

          <SearchForm 
            onSearch={handleSearch} 
            categories={categories || []} 
            initialValues={searchParams}
            isLoading={isLoadingCategories} 
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
          ) : !services || services.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No se encontraron servicios</h2>
              <p className="text-gray-600">Intenta con otros criterios de búsqueda</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mt-8 mb-4">
                <p className="text-gray-600">
                  {services.length} {services.length === 1 ? "servicio encontrado" : "servicios encontrados"}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Ordenar por:</span>
                  <select
                    className="text-sm border rounded-md p-1"
                    value={searchParams.orden}
                    onChange={(e) => {
                      setSearchParams({ ...searchParams, orden: e.target.value });
                      setCurrentPage(1);
                    }}
                  >
                    <option value="reciente">Más reciente</option>
                    <option value="calificacion">Mejor calificado</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
