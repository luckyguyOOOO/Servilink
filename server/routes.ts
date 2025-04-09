import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { 
  insertServicioSchema, 
  insertComentarioSchema, 
  insertReporteSchema, 
  insertFavoritoSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Services API
  app.get("/api/servicios", async (req, res, next) => {
    try {
      const { 
        categoria, 
        subcategoria, 
        ubicacion, 
        search, 
        orden, 
        precioMin, 
        precioMax 
      } = req.query;
      
      const servicios = await storage.getServicios({
        categoria: categoria as string,
        subcategoria: subcategoria as string,
        ubicacion: ubicacion as string,
        search: search as string,
        orden: orden as string,
        precioMin: precioMin ? Number(precioMin) : undefined,
        precioMax: precioMax ? Number(precioMax) : undefined
      });
      
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/servicios/destacados", async (req, res, next) => {
    try {
      const serviciosDestacados = await storage.getServiciosDestacados();
      res.json(serviciosDestacados);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/servicios/:id", async (req, res, next) => {
    try {
      const servicio = await storage.getServicio(parseInt(req.params.id));
      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      
      // Check if user is authenticated
      if (req.isAuthenticated()) {
        // Register access to this service
        await storage.registrarAccesoServicio({
          servicioId: servicio.id,
          usuarioId: req.user.id
        });
      }
      
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/servicios", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para publicar un servicio" });
      }
      
      // Check if user is a provider
      if (req.user.rol !== "Proveedor") {
        return res.status(403).json({ message: "Solo los proveedores pueden publicar servicios" });
      }
      
      const validatedData = insertServicioSchema.parse(req.body);
      
      const servicio = await storage.createServicio({
        ...validatedData,
        usuarioId: req.user.id
      });
      
      res.status(201).json(servicio);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        next(error);
      }
    }
  });

  // Categories API
  app.get("/api/categorias", async (req, res, next) => {
    try {
      const categorias = await storage.getCategorias();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  });

  // Comments API
  app.get("/api/servicios/:id/comentarios", async (req, res, next) => {
    try {
      const comentarios = await storage.getComentarios(parseInt(req.params.id));
      res.json(comentarios);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/servicios/:id/comentarios", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para comentar" });
      }
      
      const servicioId = parseInt(req.params.id);
      
      // Check if service exists
      const servicio = await storage.getServicio(servicioId);
      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      
      // Check if user has accessed the service (used it)
      const hasAccessed = await storage.checkServicioAcceso(servicioId, req.user.id);
      if (!hasAccessed) {
        return res.status(403).json({ message: "Solo puede comentar servicios que ha utilizado" });
      }
      
      const validatedData = insertComentarioSchema.parse({
        ...req.body,
        servicioId,
        usuarioId: req.user.id
      });
      
      const comentario = await storage.createComentario(validatedData);
      res.status(201).json(comentario);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        next(error);
      }
    }
  });

  // Favorites API
  app.get("/api/favoritos", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para ver favoritos" });
      }
      
      const favoritos = await storage.getFavoritos(req.user.id);
      res.json(favoritos);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/favoritos", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para agregar a favoritos" });
      }
      
      const validatedData = insertFavoritoSchema.parse({
        ...req.body,
        usuarioId: req.user.id
      });
      
      // Check if service exists
      const servicio = await storage.getServicio(validatedData.servicioId);
      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      
      // Check if already in favorites
      const existingFavorite = await storage.checkFavorito(validatedData.servicioId, req.user.id);
      if (existingFavorite) {
        return res.status(400).json({ message: "El servicio ya está en favoritos" });
      }
      
      const favorito = await storage.createFavorito(validatedData);
      res.status(201).json(favorito);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        next(error);
      }
    }
  });

  app.delete("/api/favoritos/:id", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para eliminar favoritos" });
      }
      
      const servicioId = parseInt(req.params.id);
      
      // Check if in favorites
      const existingFavorite = await storage.checkFavorito(servicioId, req.user.id);
      if (!existingFavorite) {
        return res.status(404).json({ message: "El servicio no está en favoritos" });
      }
      
      await storage.deleteFavorito(servicioId, req.user.id);
      res.status(200).json({ message: "Servicio eliminado de favoritos" });
    } catch (error) {
      next(error);
    }
  });

  // Reports API
  app.post("/api/reportes", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para reportar" });
      }
      
      const validatedData = insertReporteSchema.parse({
        ...req.body,
        usuarioId: req.user.id
      });
      
      // Validate that either servicioId or comentarioId is provided
      if (!validatedData.servicioId && !validatedData.comentarioId) {
        return res.status(400).json({ message: "Debe especificar un servicio o comentario a reportar" });
      }
      
      // Check if service exists when reporting a service
      if (validatedData.servicioId) {
        const servicio = await storage.getServicio(validatedData.servicioId);
        if (!servicio) {
          return res.status(404).json({ message: "Servicio no encontrado" });
        }
      }
      
      // Check if comment exists when reporting a comment
      if (validatedData.comentarioId) {
        const comentario = await storage.getComentario(validatedData.comentarioId);
        if (!comentario) {
          return res.status(404).json({ message: "Comentario no encontrado" });
        }
      }
      
      const reporte = await storage.createReporte(validatedData);
      res.status(201).json(reporte);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        next(error);
      }
    }
  });

  // Profile API
  app.get("/api/profile", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debe iniciar sesión para ver el perfil" });
      }
      
      const userData = await storage.getUserWithData(req.user.id);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
