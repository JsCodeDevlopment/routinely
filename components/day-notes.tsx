"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, Pencil, Trash, Save, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { RichTextEditor } from "./rich-text-editor"

type Note = {
  id: string
  time: string
  content: string
  status: string
}

export function DayNotes({ date, onNotesChange }: { date: Date; onNotesChange?: () => void }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState({ content: "", time: "00:00", status: "pending" })
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [date])

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?date=${date.toISOString()}`)
      if (response.status === 401) {
        router.push("/login")
        return
      }
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addNote = async () => {
    if (newNote.content) {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newNote, date: date.toISOString() }),
        })
        if (response.status === 401) {
          router.push("/login")
          return
        }
        const addedNote = await response.json()
        setNotes([...notes, addedNote])
        setNewNote({ content: "", time: "00:00", status: "pending" })
        if (onNotesChange) onNotesChange()
        toast({
          title: "Success",
          description: "Note added successfully.",
        })
      } catch (error) {
        console.error("Failed to add note:", error)
        toast({
          title: "Error",
          description: "Failed to add note. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const updateNote = async () => {
    if (editingNote) {
      try {
        const response = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingNote),
        })
        if (response.status === 401) {
          router.push("/login")
          return
        }
        if (response.ok) {
          setNotes(notes.map((note) => (note.id === editingNote.id ? editingNote : note)))
          setEditingNote(null)
          if (onNotesChange) onNotesChange()
          toast({
            title: "Success",
            description: "Note updated successfully.",
          })
        } else {
          throw new Error("Failed to update note")
        }
      } catch (error) {
        console.error("Failed to update note:", error)
        toast({
          title: "Error",
          description: "Failed to update note. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      if (response.status === 401) {
        router.push("/login")
        return
      }
      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id))
        if (onNotesChange) onNotesChange()
        toast({
          title: "Success",
          description: "Note deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete note")
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleNoteStatus = async (note: Note) => {
    const newStatus = note.status === "completed" ? "pending" : "completed"
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, status: newStatus }),
      })
      if (response.status === 401) {
        router.push("/login")
        return
      }
      if (response.ok) {
        setNotes(notes.map((n) => (n.id === note.id ? { ...n, status: newStatus } : n)))
        if (onNotesChange) onNotesChange()
        toast({
          title: "Success",
          description: `Note marked as ${newStatus}.`,
        })
      } else {
        throw new Error("Failed to update note status")
      }
    } catch (error) {
      console.error("Failed to update note status:", error)
      toast({
        title: "Error",
        description: "Failed to update note status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const timeOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{date.toDateString()}</h2>
      <div className="space-y-2 mb-4">
        <RichTextEditor
          value={newNote.content}
          onChange={(content) => setNewNote({ ...newNote, content })}
          placeholder="New note"
        />
        <div className="flex space-x-2">
          <Select value={newNote.time} onValueChange={(value) => setNewNote({ ...newNote, time: value })}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addNote}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {notes
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((note) => (
            <div key={note.id} className="flex items-start space-x-2 bg-gray-100 p-2 rounded">
              <Checkbox
                checked={note.status === "completed"}
                onCheckedChange={() => toggleNoteStatus(note)}
                className="mt-1"
              />
              {editingNote?.id === note.id ? (
                <>
                  <Select
                    value={editingNote.time}
                    onValueChange={(value) => setEditingNote({ ...editingNote, time: value })}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <RichTextEditor
                      value={editingNote.content}
                      onChange={(content) => setEditingNote({ ...editingNote, content })}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={updateNote}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditingNote(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="font-semibold w-16">{note.time}</span>
                  <div
                    className={`flex-1 ${note.status === "completed" ? "line-through text-gray-500" : ""}`}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setEditingNote(note)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

