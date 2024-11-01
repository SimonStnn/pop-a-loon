import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, Globe } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';
import Main from '@/components/Main';
import Graph from '@/components/graph';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import storage from '@/managers/storage';
import { cn } from '@/utils';

export default () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [global, setGlobal] = React.useState(true);

  const handleDatePresetChange = async (value: string) => {
    const minDate = new Date('2024-07-01');
    const today = new Date();
    let fromDate: Date | undefined = undefined;
    let toDate: Date | undefined = today;

    switch (value) {
      case 'last-week':
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;
      case 'last-month':
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
        break;
      case 'last-3-months':
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 3);
        break;
      case 'all-time':
        const accountCreationDate = new Date(
          (await storage.sync.get('user')).createdAt
        );
        fromDate = new Date(
          Math.max(minDate.getTime(), accountCreationDate.getTime())
        );
        break;
      default:
        fromDate = undefined;
        toDate = undefined;
    }
    if (fromDate && fromDate < minDate) {
      fromDate = minDate;
    }
    setDate({ from: fromDate, to: toDate });
  };

  return (
    <Main>
      <div className="mb-8 flex flex-row gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'flex-grow justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="flex w-full flex-col gap-2 p-2"
            align="start"
          >
            <Select onValueChange={handleDatePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="last-week">Last week</SelectItem>
                <SelectItem value="last-month">Last month</SelectItem>
                <SelectItem value="last-3-months">Last 3 months</SelectItem>
                <SelectItem value="all-time">All time</SelectItem>
              </SelectContent>
            </Select>
            <Calendar
              initialFocus
              className="p-0"
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              fromDate={new Date('2024-07-01')}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
        <Toggle
          variant="outline"
          aria-label="Toggle global stats"
          onClick={(e) => setGlobal(!global)}
        >
          <Globe className="size-4" />
        </Toggle>
      </div>
      {date?.from && date?.to ? (
        <Graph startDate={date?.from} endDate={date?.to} global={global} />
      ) : (
        <Skeleton className="h-[200px] w-full" />
      )}
    </Main>
  );
};
