"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Note = {
  id: string
  time: string
  content: string
}

export function DayDetailsModal({ date, onClose }: { date: Date; onClose: () => void }) {
  const [notes, setNotes] = useState<Record<string, Note>>({})

  useEffect(() => {
    // Fetch notes for the selected date
    const fetchNotes = async () => {
      const response = await fetch(`/api/notes?date=${date.toISOString()}`)
      const data = await response.json()
      const notesRecord: Record<string, Note> = {}
      data.forEach((note: Note) => {
        notesRecord[note.time] = note
      })
      setNotes(notesRecord)
    }

    fetchNotes()
  }, [date])

  const handleNoteChange = (time: string, content: string) => {
    setNotes((prev) => ({
      ...prev,
      [time]: { ...prev[time], time, content },
    }))
  }

  const saveNotes = async () => {
    // Save notes to the API
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: date.toISOString(), notes: Object.values(notes) }),
    })
    onClose()
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{date.toDateString()}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          {timeSlots.map((time) => (
            <div key={time} className="flex items-center space-x-2 mb-2">
              <span className="w-12 text-sm">{time}</span>
              <Input
                value={notes[time]?.content || ""}
                onChange={(e) => handleNoteChange(time, e.target.value)}
                placeholder="Add note"
              />
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveNotes}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

