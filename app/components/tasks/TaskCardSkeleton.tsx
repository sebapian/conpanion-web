'use client'

import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'

interface TaskCardSkeletonProps {
  className?: string
}

export function TaskCardSkeleton({ className }: TaskCardSkeletonProps) {
  return (
    <Card 
      className={cn(
        "w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Title and Priority placeholder */}
        <div className="flex items-start justify-between mb-2">
          <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
          <div className="h-5 w-6 bg-gray-700 rounded-full ml-2"></div>
        </div>
        
        {/* Description placeholder */}
        <div className="h-4 w-full bg-gray-700 rounded mb-1"></div>
        <div className="h-4 w-2/3 bg-gray-700 rounded mb-3"></div>
        
        {/* Status placeholder */}
        <div className="flex mb-3">
          <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Footer: Assignees and Due Date placeholder */}
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-4 w-20 bg-gray-700 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
} 