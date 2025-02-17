"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type Note = {
  id: string
  date: string
  time: string
  content: string
}

export function EventCalendar({ onSelectDate }: { onSelectDate: (date: Date) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    // Fetch notes for the current month
    const fetchNotes = async () => {
      if (date) {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const response = await fetch(`/api/notes?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`)
        const data = await response.json()
        setNotes(data)
      }
    }

    fetchNotes()
  }, [date])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      onSelectDate(newDate)
    }
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateChange}
      className="rounded-md border w-full h-full"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-12 w-full p-0 font-normal aria-selected:opacity-100",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      components={{
        day: ({ date, ...props }) => {
          const hasNotes = notes.some((note) => new Date(note.date).toDateString() === date.toDateString())
          return (
            <div {...props} className={cn(props.className, "relative", hasNotes && "font-bold text-primary")}>
              {props.children}
              {hasNotes && (
                <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2" />
              )}
            </div>
          )
        },
      }}
    />
  )
}

