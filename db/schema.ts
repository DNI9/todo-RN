import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable(
  "todos",
  {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    done: integer("done", { mode: "boolean" }).notNull().default(false),
    timestamp: text("timestamp")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    titleIdx: index("titleIdx").on(table.title),
  })
);

export type Todo = typeof todos.$inferSelect;
