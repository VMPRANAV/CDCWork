"use client"

/* eslint-disable react-refresh/only-export-components */

import { getDay, getDaysInMonth, isSameDay } from "date-fns"
import { atom, useAtom } from "jotai"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
} from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const monthAtom = atom(new Date().getMonth())
const yearAtom = atom(new Date().getFullYear())

export const useCalendarMonth = () => useAtom(monthAtom)
export const useCalendarYear = () => useAtom(yearAtom)

const CalendarContext = createContext({
  locale: "en-US",
  startDay: 0,
})

export const monthsForLocale = (
  localeName,
  monthFormat = "long",
) => {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat }).format

  return [...new Array(12).keys()].map((month) =>
    format(new Date(Date.UTC(2021, month, 2))),
  )
}

export const daysForLocale = (locale, startDay) => {
  const weekdays = []
  const baseDate = new Date(2024, 0, startDay)

  for (let i = 0; i < 7; i++) {
    weekdays.push(
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(baseDate),
    )
    baseDate.setDate(baseDate.getDate() + 1)
  }

  return weekdays
}

const Combobox = ({
  value,
  setValue,
  data,
  labels,
  className,
}) => (
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger className={cn("w-40 justify-between capitalize", className)}>
      <SelectValue placeholder={labels.button} />
    </SelectTrigger>
    <SelectContent>
      {data.map((item) => (
        <SelectItem
          className="capitalize"
          key={item.value}
          value={item.value}
        >
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const OutOfBoundsDay = ({ day }) => (
  <div className="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs">
    {day}
  </div>
)

export const CalendarBody = ({
  features,
  children,
  selectedDate,
  onDayClick,
}) => {
  const [month] = useCalendarMonth()
  const [year] = useCalendarYear()
  const { startDay } = useContext(CalendarContext)

  const currentMonthDate = useMemo(
    () => new Date(year, month, 1),
    [year, month],
  )
  const daysInMonth = useMemo(
    () => getDaysInMonth(currentMonthDate),
    [currentMonthDate],
  )
  const firstDay = useMemo(
    () => (getDay(currentMonthDate) - startDay + 7) % 7,
    [currentMonthDate, startDay],
  )

  const prevMonthData = useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1))
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, index) => index + 1)
    return { prevMonthDays, prevMonthDaysArray }
  }, [month, year])

  const nextMonthData = useMemo(() => {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1))
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, index) => index + 1)
    return { nextMonthDaysArray }
  }, [month, year])

  const today = useMemo(() => new Date(), [])

  const featuresByDay = useMemo(() => {
    const result = {}
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59, 999)

    for (let day = 1; day <= daysInMonth; day++) {
      result[day] = []
    }

    features.forEach((feature) => {
      const rawStart = new Date(feature.startAt ?? feature.endAt)
      const rawEnd = new Date(feature.endAt ?? feature.startAt)
      if (Number.isNaN(rawStart)) return
      if (Number.isNaN(rawEnd)) return

      const rangeStart = rawStart < monthStart ? monthStart : new Date(rawStart)
      const rangeEnd = rawEnd > monthEnd ? monthEnd : new Date(rawEnd)

      rangeStart.setHours(0, 0, 0, 0)
      rangeEnd.setHours(0, 0, 0, 0)

      const current = new Date(rangeStart)
      while (current <= rangeEnd) {
        if (current.getMonth() === month && current.getFullYear() === year) {
          const day = current.getDate()
          result[day]?.push(feature)
        }
        current.setDate(current.getDate() + 1)
      }
    })

    return result
  }, [features, daysInMonth, year, month])

  const days = []

  for (let i = 0; i < firstDay; i++) {
    const day =
      prevMonthData.prevMonthDaysArray[
        prevMonthData.prevMonthDays - firstDay + i
      ]

    if (day) {
      days.push(<OutOfBoundsDay key={`prev-${day}`} day={day} />)
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const featuresForDay = featuresByDay[day] || []

    const cellDate = new Date(year, month, day)
    const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false
    const isToday = isSameDay(cellDate, today)

    days.push(
      <button
        type="button"
        onClick={onDayClick ? () => onDayClick(cellDate) : undefined}
        className={cn(
          "flex h-full w-full flex-col gap-1 rounded-md p-1 text-left text-muted-foreground text-xs transition-colors",
          onDayClick && "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isSelected && "bg-primary/15 text-foreground ring-2 ring-primary/40",
          !isSelected && isToday && "bg-accent/30 text-foreground",
        )}
      >
        <span className="text-foreground text-sm font-medium">{day}</span>
        <div className="space-y-1">
          {featuresForDay.slice(0, 3).map((feature) => children({ feature }))}
        </div>
        {featuresForDay.length > 3 && (
          <span className="block text-muted-foreground text-xs">
            +{featuresForDay.length - 3} more
          </span>
        )}
      </button>,
    )
  }

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7)
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthData.nextMonthDaysArray[i]

      if (day) {
        days.push(<OutOfBoundsDay key={`next-${day}`} day={day} />)
      }
    }
  }

  return (
    <div className="grid flex-grow grid-cols-7">
      {days.map((day, index) => (
        <div
          className={cn(
            "relative aspect-square overflow-hidden border-t border-r",
            index % 7 === 6 && "border-r-0",
          )}
          key={index}
        >
          {day}
        </div>
      ))}
    </div>
  )
}

export const CalendarDatePicker = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-1", className)}>{children}</div>
)

export const CalendarMonthPicker = ({
  className,
}) => {
  const [month, setMonth] = useCalendarMonth()
  const { locale } = useContext(CalendarContext)

  const monthData = useMemo(() => {
    return monthsForLocale(locale).map((monthLabel, index) => ({
      value: index.toString(),
      label: monthLabel,
    }))
  }, [locale])

  return (
    <Combobox
      className={className}
      data={monthData}
      labels={{
        button: "Select month",
        empty: "No month found",
        search: "Search month",
      }}
      setValue={(value) => {
        const parsed = Number.parseInt(value, 10)
        if (!Number.isNaN(parsed)) {
          setMonth(parsed)
        }
      }}
      value={month.toString()}
    />
  )
}

export const CalendarYearPicker = ({
  className,
  start,
  end,
}) => {
  const [year, setYear] = useCalendarYear()

  const data = useMemo(
    () =>
      Array.from({ length: end - start + 1 }, (_, index) => {
        const nextYear = start + index
        return {
          value: nextYear.toString(),
          label: nextYear.toString(),
        }
      }),
    [start, end],
  )

  return (
    <Combobox
      className={className}
      data={data}
      labels={{
        button: "Select year",
        empty: "No year found",
        search: "Search year",
      }}
      setValue={(value) => {
        const parsed = Number.parseInt(value, 10)
        if (!Number.isNaN(parsed)) {
          setYear(parsed)
        }
      }}
      value={year.toString()}
    />
  )
}

export const CalendarDatePagination = ({
  className,
}) => {
  const [month, setMonth] = useCalendarMonth()
  const [year, setYear] = useCalendarYear()

  const handlePreviousMonth = useCallback(() => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }, [month, year, setMonth, setYear])

  const handleNextMonth = useCallback(() => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }, [month, year, setMonth, setYear])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button onClick={handlePreviousMonth} size="icon" variant="ghost">
        <ChevronLeftIcon size={16} />
      </Button>
      <Button onClick={handleNextMonth} size="icon" variant="ghost">
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  )
}

export const CalendarDate = ({ children }) => (
  <div className="flex items-center justify-between p-3">{children}</div>
)

export const CalendarHeader = ({ className }) => {
  const { locale, startDay } = useContext(CalendarContext)

  const daysData = useMemo(() => {
    return daysForLocale(locale, startDay)
  }, [locale, startDay])

  return (
    <div className={cn("grid flex-grow grid-cols-7", className)}>
      {daysData.map((day) => (
        <div className="p-3 text-right text-muted-foreground text-xs" key={day}>
          {day}
        </div>
      ))}
    </div>
  )
}

export const CalendarItem = memo(({ feature, className }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div
      className="h-2 w-2 shrink-0 rounded-full"
      style={{
        backgroundColor: feature.status?.color ?? "var(--primary)",
      }}
    />
    <span className="truncate">{feature.name}</span>
  </div>
))

CalendarItem.displayName = "CalendarItem"

export const CalendarProvider = ({
  locale = "en-US",
  startDay = 0,
  children,
  className,
}) => (
  <CalendarContext.Provider value={{ locale, startDay }}>
    <div className={cn("relative flex flex-col", className)}>{children}</div>
  </CalendarContext.Provider>
)
