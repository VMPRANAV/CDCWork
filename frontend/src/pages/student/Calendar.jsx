import { useCallback, useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import { CalendarIcon, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCalendar } from '@/hooks/useCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarBody,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useCalendarMonth,
  useCalendarYear,
  getFeatureVariant,
} from '@/components/ui/kibo-big-calendar';
import { cn } from '@/lib/utils';

const EVENT_COLOR_MAP = {
  round: 'hsl(var(--chart-1))',
  generic: 'hsl(var(--chart-2))',
};

const buildFeature = (resource) => {
  if (!resource?.startAt) return null;

  const start = new Date(resource.startAt);
  const end = resource.endAt ? new Date(resource.endAt) : start;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return {
    id: resource.id,
    name: resource.title || 'Event',
    startAt: start,
    endAt: end,
    status: {
      id: resource.type || 'generic',
      name: resource.type === 'round' ? 'Round' : 'Event',
      color: EVENT_COLOR_MAP[resource.type] || EVENT_COLOR_MAP.generic,
    },
    resource,
  };
};

const EventBadge = ({ feature }) => {
  const variant = getFeatureVariant(feature);

  return (
    <span
      className={cn(
        'inline-flex min-w-10 items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm',
        variant.badge,
      )}
    >
      {feature.status?.id === 'round' ? 'Rnd' : 'Evt'}
    </span>
  );
};

const StudentCalendarContent = () => {
  const navigate = useNavigate();
  const {
    events,
    loading,
    error,
    scope,
    setScope,
    setRange: changeRange,
    refetch,
  } = useCalendar({ initialScope: 'all' });

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();

  useEffect(() => {
    const monthStart = startOfMonth(new Date(year, month, 1));
    const monthEnd = endOfMonth(monthStart);
    changeRange(monthStart, monthEnd);

    setSelectedDate((prev) => {
      if (!prev) return monthStart;
      return prev.getFullYear() === year && prev.getMonth() === month ? prev : monthStart;
    });
  }, [year, month, changeRange]);

  const features = useMemo(() => events.map(buildFeature).filter(Boolean), [events]);

  const featuresByDay = useMemo(() => {
    const map = new Map();
    features.forEach((feature) => {
      const start = startOfDay(feature.startAt);
      const end = startOfDay(feature.endAt ?? feature.startAt);
      for (let current = new Date(start); current.getTime() <= end.getTime(); current.setDate(current.getDate() + 1)) {
        const key = current.getTime();
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(feature);
      }
    });
    return map;
  }, [features]);

  const selectedDayEvents = useMemo(() => {
    const key = startOfDay(selectedDate).getTime();
    return [...(featuresByDay.get(key) ?? [])].sort(
      (a, b) => a.startAt.getTime() - b.startAt.getTime(),
    );
  }, [featuresByDay, selectedDate]);

  const visibleMonth = useMemo(() => new Date(year, month, 1), [year, month]);

  const handleStep = useCallback((direction) => {
    if (direction < 0) {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else if (direction > 0) {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  }, [month, year, setMonth, setYear]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(today);
  }, [setMonth, setYear]);

  const showEmptyState = !loading && !error && features.length === 0;

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
              Navigate month by month and select any date to view its events.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex w-full items-center justify-between rounded-md border border-border/70 bg-card/80 p-2 shadow-sm sm:w-auto sm:gap-4">
              <span className="text-sm font-semibold text-muted-foreground">
                {format(visibleMonth, 'MMMM yyyy')}
              </span>
              <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/80 p-1">
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

          <CalendarDatePicker className="mb-4 flex flex-wrap items-center gap-3">
            <CalendarMonthPicker />
            <CalendarYearPicker start={year - 1} end={year + 3} />
            <CalendarDatePagination />
          </CalendarDatePicker>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-lg border border-border/60 bg-card/70 p-3 shadow-sm">
              <CalendarHeader className="border-b border-border/70" />
              <CalendarBody
                features={features}
                onDayClick={setSelectedDate}
                selectedDate={selectedDate}
              >
                {({ feature }) => (
                  <CalendarItem feature={feature} className="text-[11px]" />
                )}
              </CalendarBody>
            </div>
            <div className="space-y-4">
              {showEmptyState ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/70 bg-muted/10 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Nothing scheduled this month yet.</p>
                    <p className="text-sm text-muted-foreground">
                      Check the latest announcements or posts for updates.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/student/posts')}>
                    View Posts
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-base font-semibold">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDayEvents.length > 0
                        ? 'Here are the events scheduled for this day.'
                        : 'No events scheduled for this day. Choose another date to explore upcoming items.'}
                    </p>
                  </div>
                  {selectedDayEvents.length > 0 && (
                    <div className="space-y-3">
                      {selectedDayEvents.map((feature) => {
                        const { resource } = feature;
                        const startLabel = format(feature.startAt, 'PPpp');
                        const endLabel = feature.endAt ? format(feature.endAt, 'PPpp') : null;
                        const variant = getFeatureVariant(feature);

                        return (
                          <div
                            key={feature.id}
                            className={cn(
                              'rounded-lg border px-4 py-3 shadow-sm transition-colors',
                              variant.card,
                            )}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {resource?.title || feature.name}
                                </p>
                                {resource?.job?.companyName && (
                                  <p className="text-xs text-muted-foreground">
                                    {resource.job.companyName}{resource.job.jobTitle ? ` – ${resource.job.jobTitle}` : ''}
                                  </p>
                                )}
                              </div>
                              <EventBadge feature={feature} />
                            </div>
                            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                              <p>
                                <span className="font-medium text-foreground">Starts:</span> {startLabel}
                              </p>
                              {endLabel && (
                                <p>
                                  <span className="font-medium text-foreground">Ends:</span> {endLabel}
                                </p>
                              )}
                              {resource?.location && (
                                <p>
                                  <span className="font-medium text-foreground">Location:</span> {resource.location}
                                </p>
                              )}
                              {resource?.type === 'round' && resource?.round?.sequence && (
                                <p>
                                  <span className="font-medium text-foreground">Round:</span> #{resource.round.sequence}
                                </p>
                              )}
                            </div>
                            {resource?.description && (
                              <p className="mt-3 text-xs text-muted-foreground leading-snug">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {loading && (
                <p className="text-sm text-muted-foreground">Refreshing events…</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function Calendar() {
  return (
    <CalendarProvider>
      <StudentCalendarContent />
    </CalendarProvider>
  );
}

export default Calendar;
