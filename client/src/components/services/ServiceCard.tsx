import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Heart, Star, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: any;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favoritos", { servicioId: service.id });
    },
    onSuccess: () => {
      setIsFavorite(true);
      queryClient.invalidateQueries({ queryKey: ["/api/favoritos"] });
      toast({
        title: "Añadido a favoritos",
        description: "El servicio se ha añadido a tus favoritos",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/favoritos/${service.id}`);
    },
    onSuccess: () => {
      setIsFavorite(false);
      queryClient.invalidateQueries({ queryKey: ["/api/favoritos"] });
      toast({
        title: "Eliminado de favoritos",
        description: "El servicio se ha eliminado de tus favoritos",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (isFavorite) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  const handleCardClick = () => {
    setLocation(`/servicios/${service.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        {service.imagenes && service.imagenes.length > 0 ? (
          <img
            src={service.imagenes[0]}
            alt={service.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No hay imagen</span>
          </div>
        )}
        <div className="absolute top-0 right-0 p-2">
          <button
            className="bg-white rounded-full p-1.5 text-gray-400 hover:text-secondary-500"
            onClick={handleFavoriteToggle}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-secondary-500 text-secondary-500' : ''}`} 
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-2">
          <Badge className="bg-primary-600 text-white">{service.categoria}</Badge>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{service.titulo}</h3>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-gray-700 text-sm font-medium">
              {service.puntuacion ? service.puntuacion.toFixed(1) : "Nuevo"}
            </span>
          </div>
        </div>

        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{service.descripcion}</p>

        <div className="mt-4 flex items-center">
          {service.usuario && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={service.usuario.avatar} alt={service.usuario.nombreCompleto} />
                <AvatarFallback>
                  {service.usuario.nombreCompleto.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <span className="block text-sm font-medium text-gray-900">
                  {service.usuario.nombreCompleto}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {service.usuario.ciudad}
                    {service.usuario.pais ? `, ${service.usuario.pais}` : ""}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-primary-700 font-semibold">
            <span className="text-xs">Desde</span>
            <span className="text-lg">{service.precioEstimado}€</span>
            <span className="text-xs">/hora</span>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium">
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
