"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function DatePicker({
  date,
  setDate,
  className,
  disabled = false,
  placeholder = "Select date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full flex items-center justify-start px-3 py-2 h-10 bg-gray-700 text-white border-gray-600 hover:bg-gray-600",
            !date && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="bg-gray-800 text-white rounded border-0"
          classNames={{
            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
            day_today: "bg-gray-700 text-white",
            day: "hover:bg-gray-700 text-white focus:bg-gray-700",
            head_cell: "text-gray-400",
            cell: "text-center p-0",
            nav_button: "bg-gray-700 text-white hover:bg-gray-600",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "flex justify-center py-2 relative items-center",
            caption_label: "text-sm font-medium text-white",
            months: "flex flex-col space-y-4",
            month: "space-y-3",
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 