import { useCallback, useMemo, useState } from 'react';
import {
  Calendar as RBCalendar,
  dateFnsLocalizer
} from 'react-big-calendar';
import { addMonths, endOfMonth, format, parse, startOfMonth, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarIcon, RefreshCcw } from 'lucide-react';

import { useCalendar } from '@/hooks/useCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const buildTooltip = (resource) => {
  if (!resource) return '';
  const parts = [resource.title];
  if (resource.job?.companyName) {
    parts.push(`${resource.job.companyName}${resource.job.jobTitle ? ` – ${resource.job.jobTitle}` : ''}`);
  }
  if (resource.startAt) {
    try {
      parts.push(format(new Date(resource.startAt), 'PPpp'));
    } catch (error) {
      // ignore parse errors
    }
  }
  if (resource.location) {
    parts.push(resource.location);
  }
  if (resource.description) {
    parts.push(resource.description);
  }
  return parts.filter(Boolean).join(' | ');
};

const getShortLabel = (resource) => {
  if (!resource) return 'Evt';
  if (resource.type === 'round') return 'Rnd';
  return 'Evt';
};

const EventChip = ({ event }) => {
  const resource = event.resource;
  const tooltip = event.tooltip || buildTooltip(resource);
  const shortLabel = getShortLabel(resource);
  const colorClass = resource?.type === 'round'
    ? 'bg-blue-500/90 text-white'
    : 'bg-emerald-500/90 text-white';
  const startLabel = resource?.startAt ? format(new Date(resource.startAt), 'PPpp') : '—';
  const endLabel = resource?.endAt ? format(new Date(resource.endAt), 'PPpp') : null;

  return (
    <div className="flex h-full items-center">
      <HoverCard openDelay={150} closeDelay={100}>
        <HoverCardTrigger asChild>
          <span
            className={`inline-flex cursor-default items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm transition ${colorClass}`}
          >
            {shortLabel}
          </span>
        </HoverCardTrigger>
        <HoverCardContent align="start" side="top" className="w-72 space-y-2">
          <div>
            <p className="text-sm font-semibold text-foreground">{resource?.title || 'Event'}</p>
            {resource?.job?.companyName && (
              <p className="text-xs text-muted-foreground">
                {resource.job.companyName}{resource.job.jobTitle ? ` – ${resource.job.jobTitle}` : ''}
              </p>
            )}
          </div>
          <Separator className="bg-border/60" />
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Starts:</span> {startLabel}</p>
            {endLabel && <p><span className="font-medium text-foreground">Ends:</span> {endLabel}</p>}
            {resource?.location && (
              <p><span className="font-medium text-foreground">Location:</span> {resource.location}</p>
            )}
            {resource?.type === 'round' && resource?.round?.sequence && (
              <p><span className="font-medium text-foreground">Round:</span> #{resource.round.sequence}</p>
            )}
          </div>
          {resource?.description && (
          <Separator className="bg-border/60" />
        )}
        {resource?.description && (
          <p className="text-xs text-muted-foreground leading-snug">
            {resource.description}
            </p>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

const eventPropGetter = (event) => {
  const resource = event.resource;
  const baseColor = resource?.type === 'round' ? 'rgba(37, 99, 235, 0.18)' : 'rgba(16, 185, 129, 0.18)';
  return {
    style: {
      backgroundColor: baseColor,
      border: '1px solid rgba(255,255,255,0.05)',
      color: '#e5e7eb',
      borderRadius: '0.5rem',
      padding: '0px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  };
};

export function Calendar() {
  const {
    events,
    loading,
    error,
    scope,
    setScope,
    setRange: changeRange,
    refetch
  } = useCalendar({ initialScope: 'all' });

  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarEvents = useMemo(() => (
    events
      .map((resource) => {
        if (!resource?.startAt) return null;
        const start = new Date(resource.startAt);
        const end = resource.endAt ? new Date(resource.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
        return {
          id: resource.id,
          title: getShortLabel(resource),
          start,
          end,
          allDay: resource.calendarOptions?.allDay ?? false,
          tooltip: buildTooltip(resource),
          resource
        };
      })
      .filter(Boolean)
  ), [events]);

  const handleRangeChange = useCallback((rangeValue) => {
    if (Array.isArray(rangeValue) && rangeValue.length) {
      changeRange(rangeValue[0], rangeValue[rangeValue.length - 1]);
    } else if (rangeValue && rangeValue.start && rangeValue.end) {
      changeRange(rangeValue.start, rangeValue.end);
    }
  }, [changeRange]);

  const handleNavigate = useCallback((nextDate) => {
    setCurrentDate(nextDate);
    changeRange(startOfMonth(nextDate), endOfMonth(nextDate));
  }, [changeRange]);

  const handleStep = useCallback((direction) => {
    setCurrentDate((prev) => {
      const next = addMonths(prev, direction);
      changeRange(startOfMonth(next), endOfMonth(next));
      return next;
    });
  }, [changeRange]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    changeRange(startOfMonth(today), endOfMonth(today));
  }, [changeRange]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Keep track of your upcoming rounds and events shared with students.
        </p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Schedule overview
            </CardTitle>
            <CardDescription>
              Navigate through week, month, or day views. Hover events for full details.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border/80 bg-card/70 p-1 shadow-sm">
              <Button variant="ghost" size="sm" onClick={() => handleStep(-1)}>
                Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleStep(1)}>
                Next
              </Button>
            </div>
            <Tabs value={scope} onValueChange={setScope}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="rounds">My rounds</TabsTrigger>
                <TabsTrigger value="generic">Events</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive">{error}</div>
          )}
          <div className="h-[650px]">
            <div className="flex items-center justify-between pb-4 text-sm font-semibold text-muted-foreground">
              <span>{format(currentDate, 'MMMM yyyy')}</span>
            </div>
            <RBCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              components={{ event: EventChip }}
              eventPropGetter={eventPropGetter}
              date={currentDate}
              onNavigate={handleNavigate}
              onRangeChange={handleRangeChange}
              defaultView="month"
              views={['month']}
              popup
              selectable={false}
            />
          </div>
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">Refreshing events…</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Calendar;
