import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user profile data with services and favorites
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      },
    });
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.nombreCompleto} />
                    <AvatarFallback className="text-lg">{user?.nombreCompleto.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 font-poppins mb-1">{user?.nombreCompleto}</h1>
                    <p className="text-gray-500 mb-2">{user?.rol}</p>
                    <div className="flex flex-wrap gap-y-1 gap-x-4 justify-center md:justify-start text-sm text-gray-600">
                      <span>{user?.email}</span>
                      {user?.telefono && <span>{user?.telefono}</span>}
                      {user?.ciudad && user?.pais && <span>{user?.ciudad}, {user?.pais}</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                      <Button variant="outline" onClick={() => setLocation("/editar-perfil")}>
                        Editar Perfil
                      </Button>
                      {user?.rol === "Proveedor" && (
                        <Button onClick={() => setLocation("/agregar-servicio")}>
                          Publicar Servicio
                        </Button>
                      )}
                      <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
                        {logoutMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cerrando sesión...
                          </>
                        ) : "Cerrar Sesión"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={user?.rol === "Proveedor" ? "servicios" : "favoritos"}>
            <TabsList className="mb-6">
              {user?.rol === "Proveedor" && <TabsTrigger value="servicios">Mis Servicios</TabsTrigger>}
              <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
              {user?.rol === "Cliente" && <TabsTrigger value="historial">Historial</TabsTrigger>}
            </TabsList>

            {user?.rol === "Proveedor" && (
              <TabsContent value="servicios">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Servicios Publicados</h2>
                  <Button onClick={() => setLocation("/agregar-servicio")}>Añadir Servicio</Button>
                </div>
                
                {profileData?.servicios?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profileData.servicios.map((servicio: any) => (
                      <ServiceCard key={servicio.id} service={servicio} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-600 mb-4">No has publicado ningún servicio aún</p>
                      <Button onClick={() => setLocation("/agregar-servicio")}>Publicar mi primer servicio</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            <TabsContent value="favoritos">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Servicios Favoritos</h2>
              
              {profileData?.favoritos?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {profileData.favoritos.map((favorito: any) => (
                    <ServiceCard key={favorito.id} service={favorito.servicio} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">No has agregado ningún servicio a favoritos</p>
                    <Button variant="outline" onClick={() => setLocation("/servicios")}>Explorar servicios</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {user?.rol === "Cliente" && (
              <TabsContent value="historial">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Servicios</h2>
                
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">Historial de servicios utilizados</p>
                    {/* This would be implemented with actual backend functionality */}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
