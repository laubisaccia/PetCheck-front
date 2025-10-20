import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  customerName: string;
  petName: string;
  doctorName: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function CalendarView({ events, onEventClick, className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date.startsWith(dateStr));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const days = [];

  // Empty cells before the first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(
      <div key={`empty-${i}`} className="min-h-[120px] p-2 bg-muted/20 border border-border" />
    );
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const today = isToday(day);

    days.push(
      <div
        key={day}
        className={cn(
          "min-h-[120px] p-2 border border-border bg-card transition-colors",
          today && "bg-primary/10 ring-2 ring-primary ring-inset"
        )}
      >
        <div className={cn(
          "text-sm font-semibold mb-2",
          today ? "text-primary" : "text-muted-foreground"
        )}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick?.(event)}
              className="w-full text-left text-xs p-1.5 rounded-md bg-primary/15 hover:bg-primary/25 transition-colors border border-primary/20"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                  {event.time}
                </Badge>
              </div>
              <div className="font-medium truncate text-foreground">
                {event.customerName}
              </div>
              <div className="text-muted-foreground truncate text-[10px]">
                {event.petName}
              </div>
            </button>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-[10px] text-center text-muted-foreground font-medium pt-1">
              +{dayEvents.length - 3} más
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold bg-muted/50 border-b border-border"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    </div>
  );
}
