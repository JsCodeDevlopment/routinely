"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CalendarProps = {
  onSelectDate: (date: Date) => void;
  noteDates: { date: string; count: number }[];
};

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

  const getNotesCount = (day: number) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    const noteDate = noteDates.find((note) => note.date === dateString);
    return noteDate ? noteDate.count : 0;
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">
          {currentDate
            .toLocaleString("default", { month: "long", year: "numeric" })
            .toUpperCase()}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-5">
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
          const notesCount = getNotesCount(day);
          return (
            <Button
              key={day}
              size="lg"
              onClick={() => handleDateClick(day)}
              variant={isSelected ? "default" : "ghost"}
              className={`relative ${notesCount > 0 ? "font-bold" : ""} ${
                currentDate.getDate() === day &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? "border border-black hover:border-black/10"
                  : ""
              }`}
            >
              {day}
              {notesCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                >
                  {notesCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
