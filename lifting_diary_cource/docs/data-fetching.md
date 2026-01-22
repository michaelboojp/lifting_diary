# Data Fetching Standards

This document outlines the data fetching and database access standards for the lifting diary application.

## ⚠️ CRITICAL: Server Components ONLY

**ABSOLUTE RULE**: All data fetching in this application MUST be done via **Server Components**.

### ✅ ALLOWED: Server Components

```tsx
// ✅ CORRECT: Data fetching in Server Component
// app/dashboard/page.tsx
import { getWorkoutsByDate } from "@/data/workouts"

export default async function DashboardPage() {
  const workouts = await getWorkoutsByDate(new Date())

  return (
    <div>
      {workouts.map(workout => (
        <div key={workout.id}>{workout.exercise}</div>
      ))}
    </div>
  )
}
```

### ❌ FORBIDDEN: Route Handlers

```tsx
// ❌ WRONG: DO NOT create API route handlers for data fetching
// app/api/workouts/route.ts - DO NOT CREATE THIS
export async function GET(request: Request) {
  // This is FORBIDDEN
}
```

### ❌ FORBIDDEN: Client Component Data Fetching

```tsx
// ❌ WRONG: DO NOT fetch data in client components
"use client"

import { useEffect, useState } from "react"

export function WorkoutList() {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    // This is FORBIDDEN
    fetch('/api/workouts')
      .then(res => res.json())
      .then(setWorkouts)
  }, [])

  return <div>...</div>
}
```

### ❌ FORBIDDEN: Any Other Method

- NO fetch() calls in client components
- NO API routes for database queries
- NO direct database access outside of /data helpers
- NO third-party data fetching libraries in client components (react-query, swr, etc.)

## Database Access via /data Directory

### Structure

All database queries MUST be organized in helper functions within the `/data` directory.

```
/data
  ├── workouts.ts
  ├── exercises.ts
  ├── users.ts
  └── ...
```

### Helper Function Pattern

```tsx
// ✅ CORRECT: Helper function in /data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/auth" // or your auth solution

export async function getWorkoutsByDate(date: Date) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Use Drizzle ORM query
  return await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, session.user.id),
      eq(workouts.date, date)
    )
  })
}

export async function createWorkout(data: {
  exercise: string
  sets: number
  reps: number
  weight: number
  date: Date
}) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Use Drizzle ORM insert
  return await db.insert(workouts).values({
    ...data,
    userId: session.user.id
  })
}
```

## Drizzle ORM - NO RAW SQL

**CRITICAL**: All database queries MUST use Drizzle ORM. Raw SQL is FORBIDDEN.

### ✅ CORRECT: Drizzle ORM

```tsx
// ✅ Query with Drizzle
const results = await db.query.workouts.findMany({
  where: eq(workouts.userId, userId)
})

// ✅ Insert with Drizzle
await db.insert(workouts).values({
  exercise: "Bench Press",
  userId: userId
})

// ✅ Update with Drizzle
await db.update(workouts)
  .set({ weight: 200 })
  .where(eq(workouts.id, workoutId))

// ✅ Delete with Drizzle
await db.delete(workouts)
  .where(eq(workouts.id, workoutId))

// ✅ Complex queries with Drizzle
import { and, eq, gte, lte } from "drizzle-orm"

const results = await db.query.workouts.findMany({
  where: and(
    eq(workouts.userId, userId),
    gte(workouts.date, startDate),
    lte(workouts.date, endDate)
  ),
  orderBy: [workouts.date]
})
```

### ❌ FORBIDDEN: Raw SQL

```tsx
// ❌ WRONG: DO NOT use raw SQL
const results = await db.execute(
  sql`SELECT * FROM workouts WHERE user_id = ${userId}`
)

// ❌ WRONG: DO NOT use raw SQL strings
await db.run("INSERT INTO workouts VALUES ...")
```

## 🔒 User Data Isolation - CRITICAL SECURITY REQUIREMENT

**ABSOLUTE RULE**: A logged-in user MUST ONLY access their own data. They MUST NOT be able to access any other user's data.

### Authentication Check Pattern

Every data helper function MUST:
1. Check authentication status
2. Get the current user's ID
3. Filter ALL queries by the current user's ID
4. Throw an error if not authenticated

### ✅ CORRECT: User Data Isolation

```tsx
// ✅ CORRECT: Every function checks auth and filters by userId
export async function getWorkouts() {
  const session = await auth()

  // CRITICAL: Check authentication
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // CRITICAL: Filter by current user's ID
  return await db.query.workouts.findMany({
    where: eq(workouts.userId, session.user.id)
  })
}

export async function getWorkoutById(workoutId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // CRITICAL: Filter by BOTH workout ID AND user ID
  return await db.query.workouts.findFirst({
    where: and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, session.user.id) // MUST include user check
    )
  })
}

export async function updateWorkout(workoutId: string, data: any) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // CRITICAL: Update only if it belongs to the user
  return await db.update(workouts)
    .set(data)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, session.user.id) // MUST include user check
    ))
}

export async function deleteWorkout(workoutId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // CRITICAL: Delete only if it belongs to the user
  return await db.delete(workouts)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, session.user.id) // MUST include user check
    ))
}
```

### ❌ FORBIDDEN: Missing User Checks

```tsx
// ❌ WRONG: No authentication check
export async function getWorkouts() {
  return await db.query.workouts.findMany() // FORBIDDEN: No user filter
}

// ❌ WRONG: Missing user ID filter
export async function getWorkoutById(workoutId: string) {
  const session = await auth()

  // FORBIDDEN: Only checking workout ID, not user ownership
  return await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId)
  })
}

// ❌ WRONG: Accepting userId as parameter (security risk)
export async function getWorkouts(userId: string) {
  // FORBIDDEN: User could pass any userId
  return await db.query.workouts.findMany({
    where: eq(workouts.userId, userId)
  })
}
```

## Complete Workflow Example

### 1. Define Helper in /data

```tsx
// data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/auth"

export async function getWorkoutsByDate(date: Date) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, session.user.id),
      eq(workouts.date, date)
    )
  })
}
```

### 2. Use in Server Component

```tsx
// app/dashboard/page.tsx
import { getWorkoutsByDate } from "@/data/workouts"
import { WorkoutCard } from "@/components/workout-card"

export default async function DashboardPage() {
  // Direct call in server component
  const workouts = await getWorkoutsByDate(new Date())

  return (
    <div>
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  )
}
```

### 3. Client Component for UI Only

```tsx
// components/workout-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Client component receives data as props
export function WorkoutCard({ workout }: { workout: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.exercise}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Sets: {workout.sets}</p>
        <p>Reps: {workout.reps}</p>
      </CardContent>
    </Card>
  )
}
```

## Summary

1. **Data Fetching**: Server Components ONLY - NO route handlers, NO client fetching
2. **Database Access**: Helper functions in `/data` directory ONLY
3. **ORM**: Drizzle ORM ONLY - NO raw SQL
4. **Security**: ALWAYS check auth and filter by current user's ID
5. **User Isolation**: Users can ONLY access their own data - this is non-negotiable

## Security Checklist

Before creating any data helper function, verify:

- [ ] Function checks authentication via `auth()`
- [ ] Function gets current user's ID from session
- [ ] Function throws error if not authenticated
- [ ] ALL queries include `eq(table.userId, session.user.id)` filter
- [ ] Update/delete operations verify user ownership
- [ ] NO userId accepted as function parameter
- [ ] Uses Drizzle ORM, not raw SQL
- [ ] Called from Server Component, not route handler or client
