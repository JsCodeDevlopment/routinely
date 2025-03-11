"use client";

import { DayNotes } from "@/components/day-notes";
import { ManualCalendar } from "@/components/manual-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

type NoteDate = {
  date: string;
  count: number;
};

export default function CalendarContent({
  initialDate,
}: {
  initialDate?: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null
  );
  const [noteDates, setNoteDates] = useState<NoteDate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNoteDates();
  }, []);

  const fetchNoteDates = async () => {
    try {
      const response = await fetch("/api/notes/dates");
      if (response.ok) {
        const data: NoteDate[] = await response.json();
        setNoteDates(data);
      } else {
        throw new Error("Failed to fetch note dates");
      }
    } catch (error) {
      console.error("Error fetching note dates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch note dates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotesChange = () => {
    fetchNoteDates();
  };

  return (
    <div className="flex h-full gap-3 p-6 mb-5 max-[1193px]:flex-col">
      <div className="w-1/2 max-[1193px]:pr-0 max-[1193px]:w-full pr-3">
        <Card className="h-full">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <ManualCalendar
              onSelectDate={setSelectedDate}
              noteDates={noteDates}
            />
          </CardContent>
        </Card>
      </div>
      <div className="w-1/2 max-[1193px]:pl-0 max-[1193px]:w-full pl-3">
        <Card>
          <CardContent className="p-4">
            {selectedDate ? (
              <DayNotes date={selectedDate} onNotesChange={handleNotesChange} />
            ) : (
              <p className="text-center text-muted-foreground">
                Select a day to view notes
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
