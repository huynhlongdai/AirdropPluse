import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames";
import type { Task } from "~/data/tasks";
import styles from "./task-calendar-view.module.css";

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

interface CalendarEvent {
  task: Task;
  date: Date;
  isUrgent: boolean;
}

export default function TaskCalendarView({ tasks, onTaskClick }: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const tasksWithDeadlines: CalendarEvent[] = tasks
    .filter((t) => t.deadline)
    .map((t) => {
      const date = new Date(t.deadline!);
      const diff = date.getTime() - Date.now();
      return {
        task: t,
        date,
        isUrgent: diff < 7 * 24 * 60 * 60 * 1000,
      };
    });

  const calendarCells = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDay + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = new Date(year, month, dayNumber);
    const isToday =
      isCurrentMonth &&
      dayNumber === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    const dayEvents = tasksWithDeadlines.filter(
      (e) =>
        e.date.getDate() === dayNumber &&
        e.date.getMonth() === month &&
        e.date.getFullYear() === year,
    );

    const dailyTasks = tasks.filter((t) => t.recurring === "daily");

    return { dayNumber, isCurrentMonth, isToday, dayEvents, dailyCount: isCurrentMonth ? dailyTasks.length : 0 };
  });

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  const selectedEvents =
    selectedDate !== null
      ? tasksWithDeadlines.filter(
          (e) =>
            e.date.getDate() === selectedDate &&
            e.date.getMonth() === month &&
            e.date.getFullYear() === year,
        )
      : tasksWithDeadlines
          .filter((e) => e.date.getMonth() === month && e.date.getFullYear() === year)
          .sort((a, b) => a.date.getTime() - b.date.getTime());

  const panelTitle =
    selectedDate !== null
      ? `${currentDate.toLocaleDateString("en-US", { month: "long" })} ${selectedDate}`
      : `All deadlines in ${currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.calendarPanel}>
        <div className={styles.calendarHeader}>
          <h2 className={styles.calendarTitle}>
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className={styles.calendarNav}>
            <button className={styles.navButton} onClick={prevMonth} type="button">
              <ChevronLeft size={16} />
            </button>
            <button className={styles.navButton} onClick={nextMonth} type="button">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.calendarGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className={styles.dayHeader}>{d}</div>
          ))}
          {calendarCells.map((cell, i) => (
            <div
              key={i}
              className={classNames(styles.day, {
                [styles.dayInactive]: !cell.isCurrentMonth,
                [styles.dayToday]: cell.isToday,
                [styles.daySelected]: selectedDate === cell.dayNumber && cell.isCurrentMonth,
              })}
              onClick={() =>
                cell.isCurrentMonth &&
                setSelectedDate(selectedDate === cell.dayNumber ? null : cell.dayNumber)
              }
            >
              <span
                className={classNames(styles.dayNumber, {
                  [styles.dayTodayNumber]: cell.isToday,
                })}
              >
                {cell.isCurrentMonth ? cell.dayNumber : ""}
              </span>
              {cell.isCurrentMonth && (
                <div className={styles.dayEventDots}>
                  {cell.dailyCount > 0 && (
                    <span className={classNames(styles.dayEventDot, styles.dayEventDotDaily)} />
                  )}
                  {cell.dayEvents.map((ev) => (
                    <span
                      key={ev.task.id}
                      className={classNames(styles.dayEventDot, {
                        [styles.dayEventDotUrgent]: ev.isUrgent,
                      })}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.eventsPanel}>
        <h3 className={styles.eventsPanelTitle}>{panelTitle}</h3>
        {selectedEvents.length === 0 ? (
          <div className={styles.noEvents}>No tasks with deadlines this month.</div>
        ) : (
          selectedEvents.map(({ task, date, isUrgent }) => (
            <div key={task.id} className={styles.eventItem} onClick={onTaskClick ? () => onTaskClick(task) : undefined} style={onTaskClick ? { cursor: "pointer" } : undefined}>
              <div
                className={classNames(styles.eventDateBadge, {
                  [styles.eventUrgentBadge]: isUrgent,
                })}
              >
                <span
                  className={classNames(styles.eventDateDay, {
                    [styles.eventUrgentDay]: isUrgent,
                  })}
                >
                  {date.getDate()}
                </span>
                <span
                  className={classNames(styles.eventDateMonth, {
                    [styles.eventUrgentMonth]: isUrgent,
                  })}
                >
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </div>
              <div className={styles.eventInfo}>
                <div className={styles.eventTitle}>{task.title}</div>
                <div className={styles.eventMeta}>
                  {task.projectName && <span>{task.projectName}</span>}
                  <span>
                    {task.executions.filter((e) => e.status === "completed").length}/
                    {task.executions.length} wallets done
                  </span>
                  {isUrgent && <span style={{ color: "var(--color-error-10)" }}>⚠ Urgent</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
