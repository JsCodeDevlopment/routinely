"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type Note = {
  id: string
  content: string
}

export default function DashboardContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?date=${new Date().toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      } else {
        throw new Error("Failed to fetch notes")
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length > 0 ? (
              <ul className="list-disc pl-5">
                {notes.map((note) => (
                  <li key={note.id}>{note.content}</li>
                ))}
              </ul>
            ) : (
              <p>No notes for today.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total notes for today: {notes.length}</p>
            {/* Add more insights here as needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

