import { type ClassValue } from 'clsx';
import { Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RemoteResponse } from '@/const';
import remote from '@/remote';
import { cn } from '@/utils';

const limit = 10;
const maxPages = 10;

enum LeaderboardType {
  OVERALL = 'All time',
  MONTHLY = 'Monthly',
}

const TextSkeleton = ({ className }: { className: ClassValue }) => {
  return <Skeleton className={cn('mt-1 h-4', className)} />;
};

export default () => {
  const [data, setData] = useState({} as RemoteResponse['leaderboard']);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await remote.getLeaderboard(
        limit,
        (page - 1) * limit,
        startDate,
        endDate
      );
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, [page, startDate, endDate]);

  const loadingBody = new Array(limit).fill(0).map((item, index) => (
    <TableRow key={index} className="">
      <TableCell className="p-2 text-right">
        <TextSkeleton className="w-4" />
      </TableCell>
      <TableCell className="w-full p-2">
        <TextSkeleton className="w-20" />
      </TableCell>
      <TableCell className="p-2">
        <TextSkeleton className="w-8" />
      </TableCell>
    </TableRow>
  ));

  const Caption = () => {
    if (isLoading) {
      return <TextSkeleton className="w-16" />;
    }

    if (data.rank === null && data.user.username === undefined) {
      return (
        <p className="text-balance">
          Set your username in{' '}
          <Button variant={'link'} className="h-fit p-0 font-normal" asChild>
            <Link to="/settings">settings</Link>
          </Button>{' '}
          to view your position on the leaderboard.
        </p>
      );
    }

    return <p>You are #{data.rank}!</p>;
  };

  const PageNavigation = () => {
    return (
      <span className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
                disabled={isLoading || page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="pr-0.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          <span className="flex-grow">
            <Caption />
          </span>
          {data.rank && data.rank <= limit * maxPages && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  className="w-10 p-0"
                  disabled={
                    isLoading || Math.floor((data.rank - 1) / 10) + 1 === page
                  }
                  onClick={() =>
                    setPage(
                      data.rank
                        ? Math.min(maxPages, Math.ceil(data.rank / limit))
                        : page
                    )
                  }
                >
                  <Medal />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to my rank</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                className="w-10 p-0"
                disabled={isLoading || page >= maxPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="pl-0.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    );
  };

  const onTabsValueChange = async (value: keyof typeof LeaderboardType) => {
    switch (LeaderboardType[value]) {
      case LeaderboardType.OVERALL:
        setStartDate(null);
        setEndDate(null);
        break;
      case LeaderboardType.MONTHLY:
        setStartDate(
          new Date(
            Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
          )
        );
        break;
    }
  };

  return (
    <>
      <Tabs
        defaultValue={'OVERALL' satisfies keyof typeof LeaderboardType}
        onValueChange={(value) => {
          onTabsValueChange(value as keyof typeof LeaderboardType);
        }}
        asChild
      >
        <TabsList>
          {Object.entries(LeaderboardType).map(([key, value]) => (
            <TabsTrigger key={key} value={key} className="flex-grow capitalize">
              {value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Table>
        <TableCaption>
          <PageNavigation />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-2 text-right">#</TableHead>
            <TableHead className="h-8 w-full px-2">Name</TableHead>
            <TableHead className="h-8 px-2 text-right">Pops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? loadingBody
            : data.topUsers &&
              data.topUsers.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2 text-right">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="w-full p-2">{item.username}</TableCell>
                  <TableCell className="p-2 text-right">{item.count}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};
