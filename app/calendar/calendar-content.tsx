"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ManualCalendar } from "@/components/manual-calendar"
import { DayNotes } from "@/components/day-notes"
import { useToast } from "@/components/ui/use-toast"

export default function CalendarContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [noteDates, setNoteDates] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchNoteDates()
  }, [])

  const fetchNoteDates = async () => {
    try {
      const response = await fetch("/api/notes/dates")
      if (response.ok) {
        const data = await response.json()
        setNoteDates(data)
      } else {
        throw new Error("Failed to fetch note dates")
      }
    } catch (error) {
      console.error("Error fetching note dates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch note dates. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNotesChange = () => {
    fetchNoteDates()
  }

  return (
    <div className="flex h-full p-6">
      <div className="w-1/2 pr-3">
        <Card className="h-full">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <ManualCalendar onSelectDate={setSelectedDate} noteDates={noteDates} />
          </CardContent>
        </Card>
      </div>
      <div className="w-1/2 pl-3">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            {selectedDate ? (
              <DayNotes date={selectedDate} onNotesChange={handleNotesChange} />
            ) : (
              <p className="text-center text-muted-foreground">Select a day to view notes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

