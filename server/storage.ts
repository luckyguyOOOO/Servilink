import { 
  users, 
  servicios, 
  comentarios, 
  reportes, 
  favoritos, 
  accesoServicios,
  type User,
  type InsertUser,
  type Servicio,
  type InsertServicio,
  type Comentario,
  type InsertComentario,
  type Reporte,
  type InsertReporte,
  type Favorito,
  type InsertFavorito,
  type AccesoServicio,
  type InsertAccesoServicio
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Types for filtering services
interface ServicioFilter {
  categoria?: string;
  subcategoria?: string;
  ubicacion?: string;
  search?: string;
  orden?: string;
  precioMin?: number;
  precioMax?: number;
}

// List of categories
const CATEGORIAS = [
  { id: "limpieza", name: "Limpieza", icon: "Trash2", count: 124 },
  { id: "reparaciones", name: "Reparaciones", icon: "Tool", count: 98 },
  { id: "salud", name: "Salud y Bienestar", icon: "Heart", count: 87 },
  { id: "tecnologia", name: "Tecnología", icon: "Globe", count: 76 },
  { id: "fotografia", name: "Fotografía", icon: "Camera", count: 54 },
  { id: "educacion", name: "Educación", icon: "BookOpen", count: 67 }
];

// Interface for storage operations
export interface IStorage {
  // Session store for auth
  sessionStore: session.SessionStore;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserWithData(id: number): Promise<any>;
  
  // Service operations
  getServicios(filter?: ServicioFilter): Promise<Servicio[]>;
  getServiciosDestacados(): Promise<Servicio[]>;
  getServicio(id: number): Promise<Servicio | undefined>;
  createServicio(servicio: InsertServicio): Promise<Servicio>;
  
  // Categories operations
  getCategorias(): Promise<any[]>;
  
  // Comments operations
  getComentarios(servicioId: number): Promise<any[]>;
  getComentario(id: number): Promise<Comentario | undefined>;
  createComentario(comentario: InsertComentario): Promise<Comentario>;
  
  // Favorites operations
  getFavoritos(usuarioId: number): Promise<any[]>;
  checkFavorito(servicioId: number, usuarioId: number): Promise<boolean>;
  createFavorito(favorito: InsertFavorito): Promise<Favorito>;
  deleteFavorito(servicioId: number, usuarioId: number): Promise<void>;
  
  // Reports operations
  createReporte(reporte: InsertReporte): Promise<Reporte>;
  
  // Service access operations
  registrarAccesoServicio(acceso: InsertAccesoServicio): Promise<AccesoServicio>;
  checkServicioAcceso(servicioId: number, usuarioId: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servicios: Map<number, Servicio>;
  private comentarios: Map<number, Comentario>;
  private reportes: Map<number, Reporte>;
  private favoritos: Map<number, Favorito>;
  private accesoServicios: Map<number, AccesoServicio>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private servicioIdCounter: number;
  private comentarioIdCounter: number;
  private reporteIdCounter: number;
  private favoritoIdCounter: number;
  private accesoServicioIdCounter: number;

  constructor() {
    this.users = new Map();
    this.servicios = new Map();
    this.comentarios = new Map();
    this.reportes = new Map();
    this.favoritos = new Map();
    this.accesoServicios = new Map();
    
    this.userIdCounter = 1;
    this.servicioIdCounter = 1;
    this.comentarioIdCounter = 1;
    this.reporteIdCounter = 1;
    this.favoritoIdCounter = 1;
    this.accesoServicioIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add initial demo data
    this.addInitialData();
  }

  private addInitialData() {
    // Add sample users
    this.createUser({
      nombreCompleto: "Admin Servilink",
      email: "admin@servilink.com",
      password: "password123", // This will be hashed in auth.ts
      rol: "Admin",
      pais: "España",
      ciudad: "Madrid",
      telefono: "123456789",
      estaActivo: true,
      avatar: "/images/default-avatar.png"
    });
    
    this.createUser({
      nombreCompleto: "María López",
      email: "maria@example.com",
      password: "password123",
      rol: "Proveedor",
      pais: "España",
      ciudad: "Madrid",
      telefono: "612345678",
      estaActivo: true,
      avatar: "/images/default-avatar.png"
    });
    
    this.createUser({
      nombreCompleto: "Carlos Ruiz",
      email: "carlos@example.com",
      password: "password123",
      rol: "Proveedor",
      pais: "España",
      ciudad: "Barcelona",
      telefono: "623456789",
      estaActivo: true,
      avatar: "/images/default-avatar.png"
    });
    
    this.createUser({
      nombreCompleto: "Ana Martín",
      email: "ana@example.com",
      password: "password123",
      rol: "Proveedor",
      pais: "España",
      ciudad: "Valencia",
      telefono: "634567890",
      estaActivo: true,
      avatar: "/images/default-avatar.png"
    });
    
    this.createUser({
      nombreCompleto: "Juan Cliente",
      email: "juan@example.com",
      password: "password123",
      rol: "Cliente",
      pais: "España",
      ciudad: "Madrid",
      telefono: "645678901",
      estaActivo: true,
      avatar: "/images/default-avatar.png"
    });
    
    // Add sample services
    this.createServicio({
      usuarioId: 2, // María López
      titulo: "Limpieza profesional de hogares",
      descripcion: "Servicio de limpieza profunda para hogares y oficinas. Incluye limpieza de muebles, pisos, baños y cocina.",
      categoria: "limpieza",
      subcategoria: "hogares",
      ubicacion: "Madrid, España",
      precioEstimado: 25,
      horario: "Lunes a Viernes, 9:00 - 18:00",
      disponible: true,
      imagenes: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=350&q=80"]
    });
    
    this.createServicio({
      usuarioId: 3, // Carlos Ruiz
      titulo: "Electricista profesional",
      descripcion: "Instalaciones eléctricas, reparaciones, mantenimiento y diagnóstico. Servicio de emergencia disponible.",
      categoria: "reparaciones",
      subcategoria: "electricidad",
      ubicacion: "Barcelona, España",
      precioEstimado: 40,
      horario: "Lunes a Domingo, 8:00 - 22:00",
      disponible: true,
      imagenes: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=350&q=80"]
    });
    
    this.createServicio({
      usuarioId: 4, // Ana Martín
      titulo: "Diseño gráfico profesional",
      descripcion: "Diseño de logotipos, material publicitario, tarjetas, folletos y páginas web. Alta calidad y atención al detalle.",
      categoria: "tecnologia",
      subcategoria: "diseño",
      ubicacion: "Valencia, España",
      precioEstimado: 50,
      horario: "Lunes a Viernes, 10:00 - 19:00",
      disponible: true,
      imagenes: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=350&q=80"]
    });
    
    // Add sample comments
    this.registrarAccesoServicio({
      servicioId: 1,
      usuarioId: 5 // Juan Cliente
    });
    
    this.createComentario({
      servicioId: 1,
      usuarioId: 5, // Juan Cliente
      puntuacion: 5,
      texto: "Excelente servicio, muy profesional y puntual. Dejó mi casa impecable."
    });
    
    this.registrarAccesoServicio({
      servicioId: 2,
      usuarioId: 5 // Juan Cliente
    });
    
    this.createComentario({
      servicioId: 2,
      usuarioId: 5, // Juan Cliente
      puntuacion: 4,
      texto: "Muy buen trabajo. Resolvió el problema eléctrico rápidamente."
    });
    
    // Add sample favorites
    this.createFavorito({
      usuarioId: 5, // Juan Cliente
      servicioId: 1
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const fechaRegistro = new Date();
    const newUser: User = { id, fechaRegistro, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserWithData(id: number): Promise<any> {
    const user = await this.getUser(id);
    if (!user) {
      return undefined;
    }
    
    // Get user services if provider
    let userServicios = [];
    if (user.rol === "Proveedor") {
      userServicios = Array.from(this.servicios.values())
        .filter(servicio => servicio.usuarioId === id);
    }
    
    // Get user favorites
    const userFavoritos = Array.from(this.favoritos.values())
      .filter(favorito => favorito.usuarioId === id)
      .map(favorito => {
        const servicio = this.servicios.get(favorito.servicioId);
        return { 
          ...favorito, 
          servicio
        };
      });
    
    return {
      ...user,
      servicios: userServicios,
      favoritos: userFavoritos
    };
  }

  async getServicios(filter?: ServicioFilter): Promise<Servicio[]> {
    let result = Array.from(this.servicios.values());
    
    // Apply filters
    if (filter) {
      if (filter.categoria) {
        result = result.filter(servicio => servicio.categoria === filter.categoria);
      }
      
      if (filter.subcategoria) {
        result = result.filter(servicio => servicio.subcategoria === filter.subcategoria);
      }
      
      if (filter.ubicacion) {
        result = result.filter(servicio => 
          servicio.ubicacion.toLowerCase().includes(filter.ubicacion!.toLowerCase())
        );
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(servicio => 
          servicio.titulo.toLowerCase().includes(searchLower) || 
          servicio.descripcion.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.precioMin !== undefined) {
        result = result.filter(servicio => servicio.precioEstimado >= filter.precioMin!);
      }
      
      if (filter.precioMax !== undefined) {
        result = result.filter(servicio => servicio.precioEstimado <= filter.precioMax!);
      }
      
      // Apply sorting
      if (filter.orden) {
        switch (filter.orden) {
          case "reciente":
            result.sort((a, b) => 
              new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
            );
            break;
          case "calificacion":
            // Get average rating for each service
            const ratings = new Map<number, number>();
            for (const servicio of result) {
              const servicioComentarios = Array.from(this.comentarios.values())
                .filter(comentario => comentario.servicioId === servicio.id);
              
              if (servicioComentarios.length === 0) {
                ratings.set(servicio.id, 0);
              } else {
                const avgRating = servicioComentarios.reduce((sum, comentario) => sum + comentario.puntuacion, 0) / 
                  servicioComentarios.length;
                ratings.set(servicio.id, avgRating);
              }
            }
            
            result.sort((a, b) => (ratings.get(b.id) || 0) - (ratings.get(a.id) || 0));
            break;
          case "precio_asc":
            result.sort((a, b) => a.precioEstimado - b.precioEstimado);
            break;
          case "precio_desc":
            result.sort((a, b) => b.precioEstimado - a.precioEstimado);
            break;
        }
      }
    }
    
    // Enrich with user data
    return result.map(servicio => {
      const user = this.users.get(servicio.usuarioId);
      return {
        ...servicio,
        usuario: user ? { 
          id: user.id,
          nombreCompleto: user.nombreCompleto,
          ciudad: user.ciudad,
          pais: user.pais,
          avatar: user.avatar
        } : undefined
      };
    });
  }

  async getServiciosDestacados(): Promise<Servicio[]> {
    // Get services with highest ratings
    const result = Array.from(this.servicios.values());
    
    // Get average rating for each service
    const ratings = new Map<number, number>();
    for (const servicio of result) {
      const servicioComentarios = Array.from(this.comentarios.values())
        .filter(comentario => comentario.servicioId === servicio.id);
      
      if (servicioComentarios.length === 0) {
        ratings.set(servicio.id, 0);
      } else {
        const avgRating = servicioComentarios.reduce((sum, comentario) => sum + comentario.puntuacion, 0) / 
          servicioComentarios.length;
        ratings.set(servicio.id, avgRating);
      }
    }
    
    // Sort by rating and limit to top 4
    const sortedServices = result
      .sort((a, b) => (ratings.get(b.id) || 0) - (ratings.get(a.id) || 0))
      .slice(0, 4);
    
    // Enrich with user data
    return sortedServices.map(servicio => {
      const user = this.users.get(servicio.usuarioId);
      return {
        ...servicio,
        puntuacion: ratings.get(servicio.id) || 0,
        usuario: user ? { 
          id: user.id,
          nombreCompleto: user.nombreCompleto,
          ciudad: user.ciudad,
          pais: user.pais,
          avatar: user.avatar
        } : undefined
      };
    });
  }

  async getServicio(id: number): Promise<Servicio | undefined> {
    const servicio = this.servicios.get(id);
    if (!servicio) {
      return undefined;
    }
    
    // Get user data
    const user = this.users.get(servicio.usuarioId);
    
    // Get comments
    const servicioComentarios = Array.from(this.comentarios.values())
      .filter(comentario => comentario.servicioId === id)
      .map(comentario => {
        const commentUser = this.users.get(comentario.usuarioId);
        return {
          ...comentario,
          usuario: commentUser ? {
            id: commentUser.id,
            nombreCompleto: commentUser.nombreCompleto,
            avatar: commentUser.avatar
          } : undefined
        };
      });
    
    // Calculate average rating
    let avgRating = 0;
    if (servicioComentarios.length > 0) {
      avgRating = servicioComentarios.reduce((sum, comentario) => sum + comentario.puntuacion, 0) / 
        servicioComentarios.length;
    }
    
    return {
      ...servicio,
      usuario: user ? { 
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        telefono: user.telefono,
        ciudad: user.ciudad,
        pais: user.pais,
        avatar: user.avatar
      } : undefined,
      comentarios: servicioComentarios,
      puntuacion: avgRating
    };
  }

  async createServicio(servicio: InsertServicio): Promise<Servicio> {
    const id = this.servicioIdCounter++;
    const fechaPublicacion = new Date();
    const newServicio: Servicio = { id, fechaPublicacion, ...servicio };
    this.servicios.set(id, newServicio);
    return newServicio;
  }

  async getCategorias(): Promise<any[]> {
    return CATEGORIAS;
  }

  async getComentarios(servicioId: number): Promise<any[]> {
    const servicioComentarios = Array.from(this.comentarios.values())
      .filter(comentario => comentario.servicioId === servicioId);
    
    // Enrich with user data
    return servicioComentarios.map(comentario => {
      const user = this.users.get(comentario.usuarioId);
      return {
        ...comentario,
        usuario: user ? { 
          id: user.id,
          nombreCompleto: user.nombreCompleto,
          avatar: user.avatar
        } : undefined
      };
    });
  }

  async getComentario(id: number): Promise<Comentario | undefined> {
    return this.comentarios.get(id);
  }

  async createComentario(comentario: InsertComentario): Promise<Comentario> {
    const id = this.comentarioIdCounter++;
    const fecha = new Date();
    const newComentario: Comentario = { id, fecha, ...comentario };
    this.comentarios.set(id, newComentario);
    return newComentario;
  }

  async getFavoritos(usuarioId: number): Promise<any[]> {
    const userFavoritos = Array.from(this.favoritos.values())
      .filter(favorito => favorito.usuarioId === usuarioId);
    
    // Enrich with service data
    return userFavoritos.map(favorito => {
      const servicio = this.servicios.get(favorito.servicioId);
      const provider = servicio ? this.users.get(servicio.usuarioId) : undefined;
      
      return {
        ...favorito,
        servicio: servicio ? {
          ...servicio,
          usuario: provider ? {
            id: provider.id,
            nombreCompleto: provider.nombreCompleto,
            ciudad: provider.ciudad,
            pais: provider.pais,
            avatar: provider.avatar
          } : undefined
        } : undefined
      };
    });
  }

  async checkFavorito(servicioId: number, usuarioId: number): Promise<boolean> {
    for (const favorito of this.favoritos.values()) {
      if (favorito.servicioId === servicioId && favorito.usuarioId === usuarioId) {
        return true;
      }
    }
    return false;
  }

  async createFavorito(favorito: InsertFavorito): Promise<Favorito> {
    const id = this.favoritoIdCounter++;
    const fecha = new Date();
    const newFavorito: Favorito = { id, fecha, ...favorito };
    this.favoritos.set(id, newFavorito);
    return newFavorito;
  }

  async deleteFavorito(servicioId: number, usuarioId: number): Promise<void> {
    for (const [id, favorito] of this.favoritos.entries()) {
      if (favorito.servicioId === servicioId && favorito.usuarioId === usuarioId) {
        this.favoritos.delete(id);
        return;
      }
    }
  }

  async createReporte(reporte: InsertReporte): Promise<Reporte> {
    const id = this.reporteIdCounter++;
    const fecha = new Date();
    const newReporte: Reporte = { id, fecha, ...reporte };
    this.reportes.set(id, newReporte);
    return newReporte;
  }

  async registrarAccesoServicio(acceso: InsertAccesoServicio): Promise<AccesoServicio> {
    const id = this.accesoServicioIdCounter++;
    const fechaAcceso = new Date();
    const newAcceso: AccesoServicio = { id, fechaAcceso, ...acceso };
    this.accesoServicios.set(id, newAcceso);
    return newAcceso;
  }

  async checkServicioAcceso(servicioId: number, usuarioId: number): Promise<boolean> {
    for (const acceso of this.accesoServicios.values()) {
      if (acceso.servicioId === servicioId && acceso.usuarioId === usuarioId) {
        return true;
      }
    }
    return false;
  }
}

export const storage = new MemStorage();
