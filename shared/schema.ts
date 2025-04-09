import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombreCompleto: text("nombre_completo").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  rol: text("rol").notNull().default('Cliente'), // "Proveedor", "Cliente", "Admin"
  pais: text("pais"),
  ciudad: text("ciudad"),
  telefono: text("telefono"),
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  estaActivo: boolean("esta_activo").default(true),
  avatar: text("avatar").default("/images/default-avatar.png"),
});

// Services table
export const servicios = pgTable("servicios", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => users.id),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  categoria: text("categoria").notNull(),
  subcategoria: text("subcategoria"),
  ubicacion: text("ubicacion").notNull(),
  precioEstimado: doublePrecision("precio_estimado").notNull(),
  horario: text("horario"),
  disponible: boolean("disponible").default(true),
  fechaPublicacion: timestamp("fecha_publicacion").defaultNow(),
  imagenes: text("imagenes").array(),
});

// Comments table
export const comentarios = pgTable("comentarios", {
  id: serial("id").primaryKey(),
  servicioId: integer("servicio_id").notNull().references(() => servicios.id),
  usuarioId: integer("usuario_id").notNull().references(() => users.id),
  puntuacion: integer("puntuacion").notNull(), // 1 to 5
  texto: text("texto").notNull(),
  fecha: timestamp("fecha").defaultNow(),
});

// Reports table
export const reportes = pgTable("reportes", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => users.id), // Who reports
  servicioId: integer("servicio_id").references(() => servicios.id),
  comentarioId: integer("comentario_id").references(() => comentarios.id),
  motivo: text("motivo").notNull(),
  fecha: timestamp("fecha").defaultNow(),
});

// Favorites table
export const favoritos = pgTable("favoritos", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => users.id),
  servicioId: integer("servicio_id").notNull().references(() => servicios.id),
  fecha: timestamp("fecha").defaultNow(),
});

// Service access statistics table
export const accesoServicios = pgTable("acceso_servicios", {
  id: serial("id").primaryKey(),
  servicioId: integer("servicio_id").notNull().references(() => servicios.id),
  usuarioId: integer("usuario_id").notNull().references(() => users.id),
  fechaAcceso: timestamp("fecha_acceso").defaultNow(),
});

// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  servicios: many(servicios),
  comentarios: many(comentarios),
  reportes: many(reportes),
  favoritos: many(favoritos),
  accesoServicios: many(accesoServicios),
}));

export const serviciosRelations = relations(servicios, ({ one, many }) => ({
  usuario: one(users, {
    fields: [servicios.usuarioId],
    references: [users.id],
  }),
  comentarios: many(comentarios),
  reportes: many(reportes),
  favoritos: many(favoritos),
  accesoServicios: many(accesoServicios),
}));

export const comentariosRelations = relations(comentarios, ({ one }) => ({
  servicio: one(servicios, {
    fields: [comentarios.servicioId],
    references: [servicios.id],
  }),
  usuario: one(users, {
    fields: [comentarios.usuarioId],
    references: [users.id],
  }),
}));

// Schema definitions for insert operations
export const insertUserSchema = createInsertSchema(users).omit({ id: true, fechaRegistro: true });
export const insertServicioSchema = createInsertSchema(servicios).omit({ id: true, fechaPublicacion: true });
export const insertComentarioSchema = createInsertSchema(comentarios).omit({ id: true, fecha: true });
export const insertReporteSchema = createInsertSchema(reportes).omit({ id: true, fecha: true });
export const insertFavoritoSchema = createInsertSchema(favoritos).omit({ id: true, fecha: true });
export const insertAccesoServicioSchema = createInsertSchema(accesoServicios).omit({ id: true, fechaAcceso: true });

// Login schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico no válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Register schema with validation
export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  email: z.string().email({ message: "Correo electrónico no válido" }),
  nombreCompleto: z.string().min(2, { message: "El nombre completo es obligatorio" }),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Servicio = typeof servicios.$inferSelect;
export type InsertServicio = z.infer<typeof insertServicioSchema>;
export type Comentario = typeof comentarios.$inferSelect;
export type InsertComentario = z.infer<typeof insertComentarioSchema>;
export type Reporte = typeof reportes.$inferSelect;
export type InsertReporte = z.infer<typeof insertReporteSchema>;
export type Favorito = typeof favoritos.$inferSelect;
export type InsertFavorito = z.infer<typeof insertFavoritoSchema>;
export type AccesoServicio = typeof accesoServicios.$inferSelect;
export type InsertAccesoServicio = z.infer<typeof insertAccesoServicioSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
