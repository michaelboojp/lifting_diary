"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Set = {
  id: number
  set_number: number
  reps: number
  weight: string | null
  weight_unit: string
}

type Exercise = {
  id: number
  exercise: {
    id: number
    name: string
  }
  sets: Set[]
  notes: string | null
}

type Workout = {
  id: number
  name: string | null
  exercises: Exercise[]
}

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.name || "Workout Session"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="space-y-2">
            <h3 className="font-semibold text-lg">{exercise.exercise.name}</h3>

            <div className="space-y-1">
              {exercise.sets.map((set) => (
                <div key={set.id} className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground min-w-[60px]">
                    Set {set.set_number}:
                  </span>
                  <span className="font-medium">
                    {set.reps} reps
                  </span>
                  {set.weight && (
                    <span className="font-medium">
                      @ {set.weight} {set.weight_unit}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {exercise.notes && (
              <p className="text-sm text-muted-foreground italic mt-2">
                Note: {exercise.notes}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
