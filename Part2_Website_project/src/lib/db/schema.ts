import * as sqliteCore from "drizzle-orm/sqlite-core";


/**
 * Events Table 
 */
export const event = sqliteCore.sqliteTable("event", {
  id: sqliteCore.int().primaryKey({ autoIncrement: true }),
  name: sqliteCore.text().notNull(),
  description: sqliteCore.text().notNull(),
  slug: sqliteCore.text().notNull().unique(),
  date: sqliteCore.int({ mode: "timestamp" }).notNull(),
  categoryId: sqliteCore.int()
    .notNull()
    .references(() => event_category.id),
  location: sqliteCore.text().notNull()
});




/**
 * Event Media Table 
 */
export const event_media = sqliteCore.sqliteTable("event_media", {
  id: sqliteCore.int().primaryKey({ autoIncrement: true }),
  eventId: sqliteCore.int()
    .notNull()
    .references(() => event.id),
  url: sqliteCore.text().notNull(),
  type: sqliteCore.text().notNull().$type<"image" | "video">(),
});



/**
 * Event Category Table 
 */
export const event_category = sqliteCore.sqliteTable("event_category", {
  id: sqliteCore.int().primaryKey({ autoIncrement: true }),
  name: sqliteCore.text().notNull(),
});



/**
 * Attendee Table
 */
export const attendee = sqliteCore.sqliteTable("attendee", {
  id: sqliteCore.int().primaryKey({ autoIncrement: true }),
  name: sqliteCore.text().notNull(),
  email: sqliteCore.text().notNull().unique(),
  phonenumber: sqliteCore.text().notNull().unique(),
  eventId: sqliteCore.int()
    .notNull()
    .references(() => event.id),
});
