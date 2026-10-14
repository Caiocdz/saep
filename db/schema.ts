import { pgTable, serial, text, numeric } from "drizzle-orm/pg-core";

export const produtos = pgTable("produtos", {
  id: serial().primaryKey(),
  nome: text().notNull(),
  preco: numeric({ precision: 10, scale: 2 }).notNull(),
});
