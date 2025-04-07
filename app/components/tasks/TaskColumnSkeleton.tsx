import { Skeleton } from "../ui/skeleton"
import { TaskCardSkeleton } from "./TaskCardSkeleton"

export function TaskColumnSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24 bg-gray-700" />
        <Skeleton className="w-6 h-6 rounded-full bg-gray-700" />
      </div>
      
      <div className="space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  )
} 