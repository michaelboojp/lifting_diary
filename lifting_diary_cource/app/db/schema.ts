import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  serial,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  clerk_id: varchar("clerk_id", { length: 255 }).unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Exercise catalog - master exercise definitions
export const exerciseCatalogTable = pgTable("exercise_catalog", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: index("exercise_catalog_name_idx").on(table.name),
}));

// Workout sessions
export const workoutsTable = pgTable("workouts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {
    onDelete: "cascade"
  }).notNull(),
  name: varchar({ length: 255 }),
  workout_date: timestamp("workout_date").notNull(),
  started_at: timestamp("started_at"),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("workouts_user_id_idx").on(table.user_id),
  dateIdx: index("workouts_date_idx").on(table.workout_date),
  userDateIdx: index("workouts_user_date_idx").on(table.user_id, table.workout_date),
}));

// Exercises within a workout
export const workoutExercisesTable = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workout_id: integer("workout_id").references(() => workoutsTable.id, {
    onDelete: "cascade"
  }).notNull(),
  exercise_catalog_id: integer("exercise_catalog_id").references(() => exerciseCatalogTable.id, {
    onDelete: "restrict"
  }).notNull(),
  order: integer().notNull(),
  notes: text(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  workoutIdIdx: index("workout_exercises_workout_id_idx").on(table.workout_id),
  exerciseIdx: index("workout_exercises_exercise_idx").on(table.exercise_catalog_id),
  workoutOrderIdx: index("workout_exercises_order_idx").on(table.workout_id, table.order),
}));

// Individual sets
export const exerciseSetsTable = pgTable("exercise_sets", {
  id: serial("id").primaryKey(),
  workout_exercise_id: integer("workout_exercise_id").references(() => workoutExercisesTable.id, {
    onDelete: "cascade"
  }).notNull(),
  set_number: integer("set_number").notNull(),
  reps: integer().notNull(),
  weight: decimal({ precision: 6, scale: 2 }),
  weight_unit: varchar("weight_unit", { length: 10 }).default("kg").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  workoutExerciseIdx: index("exercise_sets_workout_exercise_idx").on(table.workout_exercise_id),
  setNumberIdx: index("exercise_sets_set_number_idx").on(table.workout_exercise_id, table.set_number),
}));

// Workout templates
export const workoutTemplatesTable = pgTable("workout_templates", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {
    onDelete: "cascade"
  }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  is_public: boolean("is_public").default(false).notNull(),
  usage_count: integer("usage_count").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("workout_templates_user_id_idx").on(table.user_id),
  publicIdx: index("workout_templates_public_idx").on(table.is_public),
}));

// Template exercises
export const templateExercisesTable = pgTable("template_exercises", {
  id: serial("id").primaryKey(),
  template_id: integer("template_id").references(() => workoutTemplatesTable.id, {
    onDelete: "cascade"
  }).notNull(),
  exercise_catalog_id: integer("exercise_catalog_id").references(() => exerciseCatalogTable.id, {
    onDelete: "restrict"
  }).notNull(),
  order: integer().notNull(),
  target_sets: integer("target_sets"),
  target_reps_min: integer("target_reps_min"),
  target_reps_max: integer("target_reps_max"),
  notes: text(),
}, (table) => ({
  templateIdIdx: index("template_exercises_template_id_idx").on(table.template_id),
  orderIdx: index("template_exercises_order_idx").on(table.template_id, table.order),
}));

// Muscle groups reference
export const muscleGroupsTable = pgTable("muscle_groups", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  category: varchar({ length: 50 }),
  description: text(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  workouts: many(workoutsTable),
  templates: many(workoutTemplatesTable),
}));

export const workoutsRelations = relations(workoutsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [workoutsTable.user_id],
    references: [usersTable.id],
  }),
  exercises: many(workoutExercisesTable),
}));

export const workoutExercisesRelations = relations(workoutExercisesTable, ({ one, many }) => ({
  workout: one(workoutsTable, {
    fields: [workoutExercisesTable.workout_id],
    references: [workoutsTable.id],
  }),
  exerciseCatalog: one(exerciseCatalogTable, {
    fields: [workoutExercisesTable.exercise_catalog_id],
    references: [exerciseCatalogTable.id],
  }),
  sets: many(exerciseSetsTable),
}));

export const exerciseSetsRelations = relations(exerciseSetsTable, ({ one }) => ({
  workoutExercise: one(workoutExercisesTable, {
    fields: [exerciseSetsTable.workout_exercise_id],
    references: [workoutExercisesTable.id],
  }),
}));

export const exerciseCatalogRelations = relations(exerciseCatalogTable, ({ many }) => ({
  workoutExercises: many(workoutExercisesTable),
  templateExercises: many(templateExercisesTable),
}));

export const workoutTemplatesRelations = relations(workoutTemplatesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [workoutTemplatesTable.user_id],
    references: [usersTable.id],
  }),
  exercises: many(templateExercisesTable),
}));

export const templateExercisesRelations = relations(templateExercisesTable, ({ one }) => ({
  template: one(workoutTemplatesTable, {
    fields: [templateExercisesTable.template_id],
    references: [workoutTemplatesTable.id],
  }),
  exerciseCatalog: one(exerciseCatalogTable, {
    fields: [templateExercisesTable.exercise_catalog_id],
    references: [exerciseCatalogTable.id],
  }),
}));
