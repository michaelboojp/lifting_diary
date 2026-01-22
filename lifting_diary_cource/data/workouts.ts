import { auth } from "@clerk/nextjs/server"
import { db } from "@/app/db"
import { workoutsTable } from "@/app/db/schema"
import { eq, and, gte, lt } from "drizzle-orm"

/**
 * Get all workouts for the current user on a specific date
 * @param date - The date to query workouts for
 * @returns Array of workouts with nested exercises and sets
 */
export async function getWorkoutsByDate(date: Date) {
  const { userId } = await auth()

  // CRITICAL: Check authentication
  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Get start and end of the day for the date range
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  // CRITICAL: Filter by current user's ID and date range
  const workouts = await db.query.workoutsTable.findMany({
    where: and(
      eq(workoutsTable.user_id, userId),
      gte(workoutsTable.workout_date, startOfDay),
      lt(workoutsTable.workout_date, endOfDay)
    ),
    with: {
      exercises: {
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.set_number)]
          }
        },
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)]
      }
    },
    orderBy: (workouts, { desc }) => [desc(workouts.workout_date)]
  })

  return workouts
}

/**
 * Get a specific workout by ID
 * @param workoutId - The workout ID
 * @returns Workout with nested exercises and sets
 */
export async function getWorkoutById(workoutId: number) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // CRITICAL: Filter by BOTH workout ID AND user ID
  const workout = await db.query.workoutsTable.findFirst({
    where: and(
      eq(workoutsTable.id, workoutId),
      eq(workoutsTable.user_id, userId)
    ),
    with: {
      exercises: {
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.set_number)]
          }
        },
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)]
      }
    }
  })

  if (!workout) {
    throw new Error("Workout not found")
  }

  return workout
}
