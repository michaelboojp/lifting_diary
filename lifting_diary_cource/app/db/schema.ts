import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  decimal,
  serial,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Exercises - master exercise definitions
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: index("exercises_name_idx").on(table.name),
}));

// Workout sessions
export const workoutsTable = pgTable("workouts", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
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
  exercise_id: integer("exercise_id").references(() => exercises.id, {
    onDelete: "restrict"
  }).notNull(),
  order: integer().notNull(),
  notes: text(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  workoutIdIdx: index("workout_exercises_workout_id_idx").on(table.workout_id),
  exerciseIdx: index("workout_exercises_exercise_idx").on(table.exercise_id),
  workoutOrderIdx: index("workout_exercises_order_idx").on(table.workout_id, table.order),
}));

// Individual sets
export const sets = pgTable("sets", {
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
  workoutExerciseIdx: index("sets_workout_exercise_idx").on(table.workout_exercise_id),
  setNumberIdx: index("sets_set_number_idx").on(table.workout_exercise_id, table.set_number),
}));


// Relations
export const workoutsRelations = relations(workoutsTable, ({ many }) => ({
  exercises: many(workoutExercisesTable),
}));

export const workoutExercisesRelations = relations(workoutExercisesTable, ({ one, many }) => ({
  workout: one(workoutsTable, {
    fields: [workoutExercisesTable.workout_id],
    references: [workoutsTable.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercisesTable.exercise_id],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercisesTable, {
    fields: [sets.workout_exercise_id],
    references: [workoutExercisesTable.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercisesTable),
}));
