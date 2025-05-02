import { integer,  pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  name: text("name").notNull(),
  // TODO: add banner fields
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, 
(t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));

export const categories = pgTable("categories", {
  id : uuid("id").primaryKey().defaultRandom(),
  name : text("name").notNull().unique(),
  description : text("description"),
  createdAt : timestamp("created_at").defaultNow().notNull(),
  updatedAt : timestamp("updated_at").defaultNow().notNull(),
},
(t) => [uniqueIndex("name_idx").on(t.name)]);

export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));
export const videoVisiblity = pgEnum("video_visibility", [
  "public",
  "private",
]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  muxAssetId: text("mux_asset_id").unique(),
  muxStatus : text("mux_status"),
  duration : integer("duration"),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  categoryId: uuid("category_id").references(() => categories.id,{
    onDelete :"set null"
  }),
  visibility: videoVisiblity("visibility").default("private").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id,{
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoSchema = createUpdateSchema(videos);

export const videoRelations = relations(videos, ({ one}) => ({
  user : one(users, {
    fields : [videos.userId],
    references : [users.id],
  }),
  category : one(categories, {
    fields : [videos.categoryId],
    references : [categories.id],
  }),
}));


