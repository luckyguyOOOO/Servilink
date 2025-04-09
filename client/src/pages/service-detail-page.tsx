import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart, Share2, Flag, MapPin, Clock, Star, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch service details
  const { data: service, isLoading, error } = useQuery({
    queryKey: [`/api/servicios/${id}`],
  });

  // State for report dialog
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Check if service is in favorites
  const { data: favorites } = useQuery({
    queryKey: ["/api/favoritos"],
    enabled: !!user, // Only run if user is logged in
  });

  const isFavorite = favorites?.some((fav: any) => fav.servicioId === parseInt(id));

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favoritos", { servicioId: parseInt(id) });
    },
    onSuccess: () => {
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
      await apiRequest("DELETE", `/api/favoritos/${id}`);
    },
    onSuccess: () => {
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

  // Report service mutation
  const reportServiceMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/reportes", { 
        servicioId: parseInt(id),
        motivo: reportReason
      });
    },
    onSuccess: () => {
      setReportDialogOpen(false);
      setReportReason("");
      toast({
        title: "Reporte enviado",
        description: "Gracias por ayudarnos a mantener la calidad de los servicios",
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
  const handleFavoriteToggle = () => {
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

  // Handle report submit
  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Error",
        description: "Por favor, indique el motivo del reporte",
        variant: "destructive",
      });
      return;
    }

    reportServiceMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Servicio no encontrado</h1>
            <p className="text-gray-600 mb-4">El servicio que buscas no existe o no está disponible</p>
            <Button onClick={() => setLocation("/servicios")}>Volver a servicios</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Service images */}
            <div className="relative h-64 md:h-96 bg-gray-200">
              {service.imagenes && service.imagenes.length > 0 ? (
                <img 
                  src={service.imagenes[0]} 
                  alt={service.titulo} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No hay imágenes disponibles</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white hover:bg-gray-100 rounded-full"
                  onClick={handleFavoriteToggle}
                  disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                >
                  <Heart 
                    className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white hover:bg-gray-100 rounded-full"
                  onClick={() => navigator.share({
                    title: service.titulo,
                    text: service.descripcion,
                    url: window.location.href,
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Enlace copiado",
                      description: "El enlace ha sido copiado al portapapeles",
                    });
                  })}
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-white hover:bg-gray-100 rounded-full"
                    >
                      <Flag className="h-5 w-5 text-gray-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reportar servicio</DialogTitle>
                      <DialogDescription>
                        ¿Cuál es el motivo del reporte? Esta información nos ayuda a mantener la calidad de los servicios.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea 
                      placeholder="Detalle el motivo del reporte" 
                      className="min-h-[100px]" 
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleReportSubmit}
                        disabled={reportServiceMutation.isPending}
                      >
                        {reportServiceMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : "Enviar reporte"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-primary-600 text-white">{service.categoria}</Badge>
                {service.subcategoria && (
                  <Badge className="ml-2 bg-white text-primary-600">{service.subcategoria}</Badge>
                )}
              </div>
            </div>

            {/* Service details */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">{service.titulo}</h1>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-600 text-sm">{service.ubicacion}</span>
                    {service.horario && (
                      <>
                        <Clock className="h-4 w-4 text-gray-500 ml-4 mr-1" />
                        <span className="text-gray-600 text-sm">{service.horario}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-1 text-gray-900 font-medium">{service.puntuacion.toFixed(1)}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">
                      {service.comentarios?.length || 0} {service.comentarios?.length === 1 ? 'comentario' : 'comentarios'}
                    </span>
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="text-primary-700 font-semibold">
                    <span className="text-sm">Desde</span>
                    <span className="text-2xl ml-1">{service.precioEstimado}€</span>
                    <span className="text-sm">/hora</span>
                  </div>
                  <Button className="mt-2 bg-secondary-500 hover:bg-secondary-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="descripcion" className="mt-8">
                <TabsList>
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
                  <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
                </TabsList>
                <TabsContent value="descripcion" className="py-4">
                  <p className="text-gray-700 whitespace-pre-line">{service.descripcion}</p>
                </TabsContent>
                <TabsContent value="proveedor" className="py-4">
                  {service.usuario ? (
                    <div className="flex items-start">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={service.usuario.avatar} alt={service.usuario.nombreCompleto} />
                        <AvatarFallback>{service.usuario.nombreCompleto.substr(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{service.usuario.nombreCompleto}</h3>
                        <p className="text-gray-600 text-sm">
                          {service.usuario.ciudad}, {service.usuario.pais}
                        </p>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="mr-2">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Mensaje
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver perfil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Información del proveedor no disponible</p>
                  )}
                </TabsContent>
                <TabsContent value="opiniones" className="py-4">
                  {service.comentarios && service.comentarios.length > 0 ? (
                    <div className="space-y-6">
                      {service.comentarios.map((comentario: any) => (
                        <Card key={comentario.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={comentario.usuario?.avatar} alt={comentario.usuario?.nombreCompleto} />
                                <AvatarFallback>
                                  {comentario.usuario?.nombreCompleto.substr(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {comentario.usuario?.nombreCompleto}
                                  </h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < comentario.puntuacion
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="mt-2 text-gray-700">{comentario.texto}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comentario.fecha).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No hay opiniones aún para este servicio</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
