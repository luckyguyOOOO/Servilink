import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertServicioSchema } from "@shared/schema";

// Extend the schema with client-side validations
const addServiceSchema = insertServicioSchema.extend({
  titulo: z.string().min(5, { message: "El título debe tener al menos 5 caracteres" }),
  descripcion: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
  categoria: z.string().min(1, { message: "Seleccione una categoría" }),
  ubicacion: z.string().min(3, { message: "Indique la ubicación donde ofrece el servicio" }),
  precioEstimado: z.coerce.number().positive({ message: "El precio debe ser un valor positivo" }),
  horario: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
});

type AddServiceFormValues = z.infer<typeof addServiceSchema>;

export default function AddServicePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if user is not a provider
  if (user && user.rol !== "Proveedor") {
    setLocation("/");
  }

  // Get categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categorias"],
  });

  const form = useForm<AddServiceFormValues>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      categoria: "",
      subcategoria: "",
      ubicacion: user?.ciudad ? `${user.ciudad}, ${user.pais}` : "",
      precioEstimado: 0,
      horario: "",
      imagenes: [],
    },
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (data: AddServiceFormValues) => {
      // Process data if needed
      const serviceData = {
        ...data,
        // Currently using simple strings for images
        imagenes: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952"]
      };
      
      const res = await apiRequest("POST", "/api/servicios", serviceData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Servicio publicado",
        description: "Tu servicio ha sido publicado correctamente",
      });
      setLocation("/perfil");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al publicar el servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handler
  function onSubmit(data: AddServiceFormValues) {
    createServiceMutation.mutate(data);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-poppins">
                Publicar un Nuevo Servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del servicio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Limpieza profesional de hogares" {...field} />
                        </FormControl>
                        <FormDescription>
                          Un título descriptivo que resuma el servicio que ofreces
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe en detalle el servicio que ofreces, incluyendo lo que está incluido" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Sé específico sobre lo que incluye tu servicio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                              disabled={isLoadingCategories}
                            >
                              <option value="">Selecciona una categoría</option>
                              {categories?.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subcategoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategoría (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Limpieza de oficinas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Madrid, España" {...field} />
                        </FormControl>
                        <FormDescription>
                          ¿Dónde ofreces este servicio?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="precioEstimado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio estimado (€/hora)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horario (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Lunes a Viernes, 9:00 - 18:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Image upload would be implemented here with a proper file upload component */}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/perfil")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createServiceMutation.isPending}
                    >
                      {createServiceMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publicando...
                        </>
                      ) : "Publicar Servicio"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
