"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Mock workout data for UI demonstration
  const mockWorkouts = [
    {
      id: 1,
      exercise: "Bench Press",
      sets: 4,
      reps: 8,
      weight: "185 lbs"
    },
    {
      id: 2,
      exercise: "Squats",
      sets: 5,
      reps: 5,
      weight: "225 lbs"
    },
    {
      id: 3,
      exercise: "Deadlift",
      sets: 3,
      reps: 6,
      weight: "275 lbs"
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Dashboard</h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "do MMM yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h2>

        {mockWorkouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.exercise}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sets:</span>
                      <span className="font-medium">{workout.sets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reps:</span>
                      <span className="font-medium">{workout.reps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{workout.weight}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No workouts logged for this date.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
