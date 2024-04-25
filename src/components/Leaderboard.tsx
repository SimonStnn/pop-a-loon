import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import remote from '@/remote';
import { RemoteResponse } from '@/const';

export default () => {
  const [data, setData] = useState({} as RemoteResponse['leaderboard']);

  useEffect(() => {
    const fetchData = async () => {
      const result = await remote.getLeaderboard(10);
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <Table>
        <TableCaption>You are #{data.rank}!</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-2 text-right">#</TableHead>
            <TableHead className="h-8 px-2 w-full">Name</TableHead>
            <TableHead className="h-8 px-2">Pops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.topUsers &&
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
