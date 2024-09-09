import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';

export default () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  return (
    <Main>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
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
      {date?.from && date?.to ? (
        <Graph startDate={date?.from} endDate={date?.to} />
      ) : (
        <Skeleton className="h-[200px] w-full" />
      )}
    </Main>
  );
};
