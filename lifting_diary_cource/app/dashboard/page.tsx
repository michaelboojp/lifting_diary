import { format, parse } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { getWorkoutsByDate } from "@/data/workouts"
import { DatePicker } from "@/components/date-picker"
import { WorkoutCard } from "@/components/workout-card"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams

  // Get date from URL params or default to today (in JST)
  const selectedDate = params.date
    ? parse(params.date, "yyyy-MM-dd", new Date())
    : toZonedTime(new Date(), "Asia/Tokyo")

  // Fetch workouts for the selected date (Server Component data fetching)
  const workouts = await getWorkoutsByDate(selectedDate)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Dashboard</h1>

        <DatePicker selectedDate={selectedDate} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h2>

        {workouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
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
