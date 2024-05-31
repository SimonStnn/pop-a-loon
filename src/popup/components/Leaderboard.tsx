import React, { useState, useEffect } from 'react';
import { type ClassValue } from 'clsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import remote from '@/remote';
import { RemoteResponse } from '@/const';
import { cn } from '@/utils';

const limit = 10;

const TextSkeleton = ({ className }: { className: ClassValue }) => {
  return <Skeleton className={cn('h-4 mt-1', className)} />;
};

export default () => {
  const [data, setData] = useState({} as RemoteResponse['leaderboard']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await remote.getLeaderboard(limit);
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const loadingBody = new Array(limit).fill(0).map((item, index) => (
    <TableRow key={index} className="">
      <TableCell className="p-2 text-right">
        <TextSkeleton className="w-4" />
      </TableCell>
      <TableCell className="p-2 w-full">
        <TextSkeleton className="w-20" />
      </TableCell>
      <TableCell className="p-2">
        <TextSkeleton className="w-8" />
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <Table>
        <TableCaption>
          {isLoading ? (
            <TextSkeleton className="w-12" />
          ) : (
            <p>You are #{data.rank}!</p>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-2 text-right">#</TableHead>
            <TableHead className="h-8 px-2 w-full">Name</TableHead>
            <TableHead className="h-8 px-2">Pops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? loadingBody
            : data.topUsers &&
              data.topUsers.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2 text-right">{index + 1}</TableCell>
                  <TableCell className="p-2 w-full">{item.username}</TableCell>
                  <TableCell className="p-2">{item.count}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};
