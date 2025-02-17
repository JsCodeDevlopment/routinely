"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CalendarProps = {
  onSelectDate: (date: Date) => void;
  noteDates: string[];
};

//TODO: não importa qual dia da semana eu clique, sempre é exibido todas as notas já criadas, quando deveria ser exibido apenas as notas daquele dia

export function ManualCalendar({ onSelectDate, noteDates }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    onSelectDate(clickedDate);
  };

  const hasNotes = (day: number) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return noteDates.includes(dateString);
  };

  const getNotesCount = (day: number) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return noteDates[dateString] || 0;
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-lg py-1">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="text-center py-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isSelected =
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === currentDate.getMonth() &&
            selectedDate?.getFullYear() === currentDate.getFullYear();
          const hasNotesForDay = hasNotes(day);

          const notesCount = getNotesCount(day);
          return (
            <Button
              key={day}
              size="lg"
              onClick={() => handleDateClick(day)}
              variant={isSelected ? "default" : "ghost"}
              className={`relative py-10 ${hasNotesForDay ? "font-bold" : ""}`}
            >
              {day}
              {hasNotesForDay && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 right-1 text-white text-xs px-2 py-1 rounded-full"
                >
                  {
                    noteDates.filter(
                      (date) =>
                        new Date(date).toISOString().split("T")[0] ===
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                          .toISOString()
                          .split("T")[0]
                    ).length
                  }
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
