'use client'

import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'

interface DragPlaceholderProps {
  className?: string
  height?: number | string
}

export function DragPlaceholder({ className, height }: DragPlaceholderProps) {
  return (
    <Card 
      className={cn(
        "w-full border-2 border-dashed rounded-lg shadow transition-all",
        "border-blue-500 dark:border-blue-500",
        "bg-blue-50 dark:bg-blue-500/10",
        "animate-pulse",
        className
      )}
      style={{ height: height ? `${height}px` : 'auto' }}
    >
      <CardContent className="p-4">
        {/* Title and Priority placeholder */}
        <div className="flex items-start justify-between mb-2">
          <div className="h-5 w-3/4 bg-blue-100 dark:bg-blue-500/20 rounded"></div>
          <div className="h-5 w-6 bg-blue-100 dark:bg-blue-500/20 rounded-full ml-2"></div>
        </div>
        
        {/* Description placeholder */}
        <div className="h-4 w-full bg-blue-100 dark:bg-blue-500/20 rounded mb-1"></div>
        <div className="h-4 w-2/3 bg-blue-100 dark:bg-blue-500/20 rounded mb-3"></div>
        
        {/* Status placeholder */}
        <div className="flex mb-3">
          <div className="h-6 w-20 bg-blue-100 dark:bg-blue-500/20 rounded-full"></div>
        </div>
        
        {/* Footer: Assignees and Due Date placeholder */}
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 bg-blue-100 dark:bg-blue-500/20 rounded-full"></div>
            <div className="h-6 w-6 bg-blue-100 dark:bg-blue-500/20 rounded-full"></div>
          </div>
          <div className="h-4 w-20 bg-blue-100 dark:bg-blue-500/20 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
} 