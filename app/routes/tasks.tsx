import React from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/tasks";
import { mockProjects } from "~/data/projects";
import styles from "./tasks.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task & Calendar View - AirdropPulse" },
    {
      name: "description",
      content: "Manage your airdrop tasks and deadlines",
    },
  ];
}

export default function Tasks() {
  const [view, setView] = React.useState<"timeline" | "calendar">("timeline");
  const [currentDate] = React.useState(new Date());

  const upcomingEvents = mockProjects
    .filter((p) => p.snapshotDate || p.claimDate || p.expiryDate)
    .flatMap((p) => {
      const events = [];
      if (p.snapshotDate) {
        events.push({
          id: `${p.id}-snapshot`,
          projectName: p.name,
          type: "snapshot",
          date: new Date(p.snapshotDate),
          urgent: new Date(p.snapshotDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000,
        });
      }
      if (p.claimDate) {
        events.push({
          id: `${p.id}-claim`,
          projectName: p.name,
          type: "claim",
          date: new Date(p.claimDate),
          urgent: false,
        });
      }
      if (p.expiryDate) {
        events.push({
          id: `${p.id}-expiry`,
          projectName: p.name,
          type: "expiry",
          date: new Date(p.expiryDate),
          urgent: new Date(p.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000,
        });
      }
      return events;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const thisWeek = upcomingEvents.filter((e) => {
    const diff = e.date.getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });

  const thisMonth = upcomingEvents.filter((e) => {
    const diff = e.date.getTime() - Date.now();
    return diff >= 7 * 24 * 60 * 60 * 1000 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  const formatEventDate = (date: Date) => {
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const hasEvent = upcomingEvents.some(
      (e) =>
        e.date.getDate() === dayNumber &&
        e.date.getMonth() === currentDate.getMonth() &&
        e.date.getFullYear() === currentDate.getFullYear(),
    );
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    return {
      dayNumber: isCurrentMonth ? dayNumber : "",
      isCurrentMonth,
      hasEvent,
      isToday,
    };
  });

  return (
    <main className={styles.tasks}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Task & Calendar View</h1>
          <p className={styles.subtitle}>Temporal management of airdrop activities and deadlines</p>
        </header>

        <div className={styles.viewToggle}>
          <button
            className={classNames(styles.viewButton, { [styles.viewButtonActive]: view === "timeline" })}
            onClick={() => setView("timeline")}
          >
            Timeline View
          </button>
          <button
            className={classNames(styles.viewButton, { [styles.viewButtonActive]: view === "calendar" })}
            onClick={() => setView("calendar")}
          >
            Calendar View
          </button>
        </div>

        {view === "timeline" && (
          <div className={styles.timeline}>
            {thisWeek.length > 0 && (
              <div className={styles.timelineSection}>
                <div className={styles.sectionHeader}>
                  <AlertCircle className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>This Week</h2>
                  <span className={styles.sectionCount}>{thisWeek.length}</span>
                </div>
                <div className={styles.eventsList}>
                  {thisWeek.map((event) => {
                    const { day, month } = formatEventDate(event.date);
                    return (
                      <div key={event.id} className={styles.event}>
                        <div className={styles.eventDate}>
                          <div className={styles.eventDay}>{day}</div>
                          <div className={styles.eventMonth}>{month}</div>
                        </div>
                        <div className={styles.eventContent}>
                          <h3 className={styles.eventTitle}>{event.projectName}</h3>
                          <div className={styles.eventMeta}>
                            <span
                              className={classNames(styles.eventBadge, {
                                [styles.urgentBadge]: event.urgent,
                              })}
                            >
                              {event.type}
                            </span>
                            {event.urgent && (
                              <span className={styles.urgentBadge}>
                                <AlertCircle
                                  style={{ width: "14px", height: "14px", display: "inline", marginRight: "4px" }}
                                />
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {thisMonth.length > 0 && (
              <div className={styles.timelineSection}>
                <div className={styles.sectionHeader}>
                  <Clock className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>This Month</h2>
                  <span className={styles.sectionCount}>{thisMonth.length}</span>
                </div>
                <div className={styles.eventsList}>
                  {thisMonth.map((event) => {
                    const { day, month } = formatEventDate(event.date);
                    return (
                      <div key={event.id} className={styles.event}>
                        <div className={styles.eventDate}>
                          <div className={styles.eventDay}>{day}</div>
                          <div className={styles.eventMonth}>{month}</div>
                        </div>
                        <div className={styles.eventContent}>
                          <h3 className={styles.eventTitle}>{event.projectName}</h3>
                          <div className={styles.eventMeta}>
                            <span className={styles.eventBadge}>{event.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {view === "calendar" && (
          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <h2 className={styles.calendarTitle}>
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <div className={styles.calendarNav}>
                <button className={styles.navButton}>
                  <ChevronLeft style={{ width: "20px", height: "20px" }} />
                </button>
                <button className={styles.navButton}>
                  <ChevronRight style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>

            <div className={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className={styles.dayHeader}>
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={classNames(styles.day, {
                    [styles.dayInactive]: !day.isCurrentMonth,
                    [styles.dayToday]: day.isToday,
                    [styles.dayHasEvent]: day.hasEvent,
                  })}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
