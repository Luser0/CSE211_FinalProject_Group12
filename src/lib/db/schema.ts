import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const event = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  slug: text().notNull().unique(),
  date: int({ mode: "timestamp" }).notNull(),
  categoryId: int()
    .notNull()
    .references(() => event_category.id),
});

export const event_media = sqliteTable("event_media", {
  id: int().primaryKey({ autoIncrement: true }),
  eventId: int()
    .notNull()
    .references(() => event.id),
  url: text().notNull(),
  type: text().notNull().$type<"image" | "video">(),
});

export const event_category = sqliteTable("event_category", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const attendee = sqliteTable("attendee", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  phonenumber: text().notNull().unique(),
  eventId: int()
    .notNull()
    .references(() => event.id),
});
