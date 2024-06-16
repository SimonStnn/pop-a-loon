import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import remote from '@/remote';
import { RemoteResponse } from '@/const';
import { cn } from '@/utils';
import { Button } from './ui/button';

const limit = 10;
const maxPages = 10;

const TextSkeleton = ({ className }: { className: ClassValue }) => {
  return <Skeleton className={cn('mt-1 h-4', className)} />;
};

export default () => {
  const [data, setData] = useState({} as RemoteResponse['leaderboard']);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await remote.getLeaderboard(limit, (page - 1) * limit);
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, [page]);

  const PageNaviation = () => {
    const Item = (props: { page: number }) => {
      return (
        <PaginationItem>
          <PaginationLink
            to={''}
            className="font-normal"
            isActive={props.page === page}
            onClick={() => setPage(props.page)}
          >
            {props.page}
          </PaginationLink>
        </PaginationItem>
      );
    };

    const pages: number[] = [];

    if (page > 2) pages.push(page - 1);
    if (page !== 1 && page !== maxPages) pages.push(page);
    if (page < maxPages - 1) pages.push(page + 1);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button variant={'ghost'} className="p-0" disabled={page === 1}>
              <PaginationPrevious
                to={''}
                text=""
                className="w-10 p-0"
                onClick={() => setPage(page - 1)}
              />
            </Button>
          </PaginationItem>

          <Item page={1} />
          {page > 2 && (
            <PaginationItem>
              <PaginationEllipsis className="w-4" />
            </PaginationItem>
          )}
          {pages.map((item, index) => (
            <Item key={index} page={item} />
          ))}
          {page < maxPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis className="w-4" />
            </PaginationItem>
          )}
          <Item page={maxPages} />

          <PaginationItem>
            <Button
              variant={'ghost'}
              className="p-0"
              disabled={page === maxPages}
            >
              <PaginationNext
                to={''}
                text=""
                className="w-10 p-0"
                onClick={() => setPage(page + 1)}
              />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

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
      return <TextSkeleton className="w-12" />;
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

  return (
    <>
      <Table>
        <TableCaption>
          <Caption />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-2 text-right">#</TableHead>
            <TableHead className="h-8 w-full px-2">Name</TableHead>
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
                  <TableCell className="w-full p-2">{item.username}</TableCell>
                  <TableCell className="p-2">{item.count}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <PageNaviation />
    </>
  );
};
