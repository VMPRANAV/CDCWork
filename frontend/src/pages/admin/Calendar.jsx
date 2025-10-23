import { useCallback, useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import { CalendarIcon, Plus, RefreshCcw } from 'lucide-react';

import { useCalendar } from '@/hooks/useCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as DateCalendar } from '@/components/ui/calendar';
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

const VISIBILITY_OPTIONS = [
  { value: 'all', label: 'Everyone' },
  { value: 'student', label: 'Students' },
  { value: 'admin', label: 'Admins only' },
];

const defaultFormState = () => ({
  title: '',
  description: '',
  startAt: null,
  endAt: null,
  visibility: 'all',
  location: '',
  calendarOptions: {
    allDay: false,
  },
});

const EVENT_COLOR_MAP = {
  round: 'hsl(var(--chart-1))',
  generic: 'hsl(var(--chart-2))',
  admin: 'hsl(var(--chart-3))',
};

const buildFeature = (resource) => {
  if (!resource?.startAt) return null;

  const start = new Date(resource.startAt);
  const end = resource.endAt ? new Date(resource.endAt) : start;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const type = resource.type || 'generic';

  return {
    id: resource.id,
    name: resource.title || 'Event',
    startAt: start,
    endAt: end,
    status: {
      id: type,
      name: type === 'round' ? 'Round' : 'Event',
      color: EVENT_COLOR_MAP[type] || EVENT_COLOR_MAP.generic,
    },
    resource,
  };
};

const EventBadge = ({ feature }) => {
  const variant = getFeatureVariant(feature);

  return (
    <span className={cn(
      'inline-flex min-w-10 items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm',
      variant.badge,
    )}
    >
      {feature.status?.id === 'round' ? 'Rnd' : 'Evt'}
    </span>
  );
};

const AdminCalendarContent = () => {
  const {
    events,
    loading,
    error,
    scope,
    setScope,
    setRange: changeRange,
    refetch,
    createEvent,
  } = useCalendar({ initialScope: 'all' });

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

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

  const handleFormChange = (field) => (eventOrValue) => {
    const value = eventOrValue?.target?.type === 'checkbox'
      ? eventOrValue.target.checked
      : eventOrValue?.target?.value ?? eventOrValue;

    setForm((prev) => {
      if (field.startsWith('calendarOptions.')) {
        const [, key] = field.split('.');
        return {
          ...prev,
          calendarOptions: {
            ...prev.calendarOptions,
            [key]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
    setFormError(null);
  };

  const setDateField = (field, updater) => {
    setForm((prev) => {
      const currentValue = prev[field];
      const nextValue = updater(currentValue ? new Date(currentValue) : null);
      return {
        ...prev,
        [field]: nextValue,
      };
    });
    setFormError(null);
  };

  const handleDateSelect = (field) => (date) => {
    if (!date) return;
    setDateField(field, (current) => {
      const base = current ?? date;
      const next = new Date(base);
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return next;
    });
  };

  const handleTimeChange = (field) => (event) => {
    const value = event.target.value;
    setDateField(field, (current) => {
      if (!value) {
        return current;
      }
      const [hours, minutes] = value.split(':').map(Number);
      if (!current) {
        return current;
      }
      const source = current;
      const next = new Date(source);
      next.setHours(hours ?? 0, minutes ?? 0, 0, 0);
      return next;
    });
  };

  const handleCreateEvent = async () => {
    if (!createEvent) return;
    if (!form.startAt) {
      setFormError('Please choose a start date and time.');
      return;
    }
    if (form.endAt && form.endAt < form.startAt) {
      setFormError('End time must be after the start time.');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startAt: form.startAt.toISOString(),
        endAt: form.endAt ? form.endAt.toISOString() : undefined,
        visibility: form.visibility,
        location: form.location,
        calendarOptions: form.calendarOptions,
        type: 'generic',
      };
      await createEvent(payload);
      setDialogOpen(false);
      setForm(defaultFormState());
    } finally {
      setSaving(false);
    }
  };

  const showEmptyState = !loading && !error && features.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Monitor job rounds and publish generic events for the student community.
          </p>
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
          <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog
            open={dialogOpen}
            onOpenChange={(next) => {
              setDialogOpen(next);
              setFormError(null);
              if (!next) {
                setForm(defaultFormState());
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Calendar Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Event title"
                    value={form.title}
                    onChange={handleFormChange('title')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Details for attendees"
                    rows={3}
                    value={form.description}
                    onChange={handleFormChange('description')}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !form.startAt && 'text-muted-foreground',
                          )}
                        >
                          {form.startAt ? format(form.startAt, 'PP pp') : 'Pick start date & time'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto space-y-2 p-3" align="start">
                        <DateCalendar
                          mode="single"
                          selected={form.startAt ?? undefined}
                          onSelect={handleDateSelect('startAt')}
                          initialFocus
                        />
                        <Input
                          type="time"
                          value={form.startAt ? format(form.startAt, 'HH:mm') : ''}
                          onChange={handleTimeChange('startAt')}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End (optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !form.endAt && 'text-muted-foreground',
                          )}
                        >
                          {form.endAt ? format(form.endAt, 'PP pp') : 'Pick end date & time'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto space-y-2 p-3" align="start">
                        <DateCalendar
                          mode="single"
                          selected={form.endAt ?? undefined}
                          onSelect={handleDateSelect('endAt')}
                        />
                        <Input
                          type="time"
                          value={form.endAt ? format(form.endAt, 'HH:mm') : ''}
                          onChange={handleTimeChange('endAt')}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="Venue or meeting link"
                    value={form.location}
                    onChange={handleFormChange('location')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Visibility</Label>
                  <Tabs value={form.visibility} onValueChange={(value) => setForm((prev) => ({ ...prev, visibility: value }))}>
                    <TabsList className="grid grid-cols-3">
                      {VISIBILITY_OPTIONS.map((option) => (
                        <TabsTrigger key={option.value} value={option.value}>
                          {option.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center justify-between rounded-md border border-dashed border-border/70 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">All day</p>
                    <p className="text-xs text-muted-foreground">Marks this event as an all-day entry.</p>
                  </div>
                  <Switch
                    checked={form.calendarOptions.allDay}
                    onCheckedChange={(value) => handleFormChange('calendarOptions.allDay')({
                      target: { type: 'checkbox', checked: value },
                    })}
                  />
                </div>
                {formError && (
                  <p className="text-sm text-destructive">{formError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateEvent} disabled={saving || !form.title || !form.startAt}>
                  {saving ? 'Saving…' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Schedule overview
            </CardTitle>
            <CardDescription>
              Switch filters or select dates to inspect the campus schedule.
            </CardDescription>
          </div>
          <Tabs value={scope} onValueChange={setScope}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="rounds">Rounds</TabsTrigger>
              <TabsTrigger value="generic">Events</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive">{error}</div>
          )}

          <CalendarDatePicker className="mb-4 flex flex-wrap items-center gap-3">
            <CalendarMonthPicker />
            <CalendarYearPicker start={year - 1} end={year + 5} />
            <CalendarDatePagination />
          </CalendarDatePicker>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-lg border border-border/60 bg-card/70 p-3 shadow-sm">
              <CalendarHeader className="border-b border-border/70" />
              <CalendarBody
                features={features}
                onDayClick={setSelectedDate}
                selectedDate={selectedDate}
              >
                {({ feature }) => (
                  <CalendarItem
                    key={feature.id ?? feature._id ?? `${feature.startAt}-${feature.endAt}`}
                    feature={feature}
                    className="text-[11px]"
                  />
                )}
              </CalendarBody>
            </div>
            <div className="space-y-4">
              {showEmptyState ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/70 bg-muted/10 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">No events scheduled this month.</p>
                    <p className="text-sm text-muted-foreground">
                      Start by creating a generic event or publishing job rounds.
                    </p>
                  </div>
                  <Button onClick={() => setDialogOpen(true)}>Create Event</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-semibold">
                        {format(selectedDate, 'EEEE, MMMM d')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedDayEvents.length > 0
                          ? 'Review the scheduled activity for this day.'
                          : 'No events scheduled for this day. Select a highlighted date to review activity.'}
                      </p>
                    </div>
                  </div>
                  {selectedDayEvents.length > 0 && (
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                      {selectedDayEvents.map((feature) => {
                        const { resource } = feature;
                        const startLabel = format(feature.startAt, 'PPpp');
                        const endLabel = feature.endAt ? format(feature.endAt, 'PPpp') : null;
                        const visibility = resource?.visibility ?? 'all';
                        const isAllDay = resource?.calendarOptions?.allDay;

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
                            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
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
                              <p>
                                <span className="font-medium text-foreground">Visibility:</span> {visibility}
                              </p>
                              {isAllDay && (
                                <p className="font-medium text-foreground">All-day event</p>
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
  const { locale, startDay } = useMemo(() => {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    const fallbackLocale = typeof navigator !== 'undefined' && navigator.language
      ? navigator.language
      : 'en-US';
    const localeValue = resolved?.locale || fallbackLocale || 'en-US';

    let firstDay = 0;
    if (typeof Intl.Locale === 'function') {
      try {
        const localeInfo = new Intl.Locale(localeValue);
        const parsedFirstDay = localeInfo.weekInfo?.firstDay;
        if (typeof parsedFirstDay === 'number') {
          firstDay = parsedFirstDay % 7;
        }
      } catch {
        firstDay = 0;
      }
    }

    return { locale: localeValue, startDay: firstDay };
  }, []);

  return (
    <CalendarProvider locale={locale} startDay={startDay}>
      <AdminCalendarContent />
    </CalendarProvider>
  );
}

export default Calendar;
