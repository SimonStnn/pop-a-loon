import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BalloonName, HistoryBucket, HistoryNode } from '@/const';
import remote from '@/remote';

export default (props: { startDate: Date; endDate: Date; global: boolean }) => {
  const [data, setData] = useState({} as (HistoryNode & { total: number })[]);
  const [poppedBalloonTypes, setPoppedBalloonTypes] = useState<BalloonName[]>(
    []
  );
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [bucket, setBucket] = useState<HistoryBucket>('day');

  useEffect(() => {
    const fetchData = async () => {
      const response = await remote.getPopHistory(
        props.startDate,
        props.endDate,
        props.global
      );

      const allBalloonNames = [
        ...new Set(
          response.history
            .map((node) => Object.keys(node.pops) as BalloonName[])
            .flat()
        ),
      ];

      setBucket(response.bucket ?? 'day');
      setPoppedBalloonTypes(allBalloonNames);

      const newChartConfig: ChartConfig = {};
      for (const type of allBalloonNames) {
        newChartConfig[type] = {
          color: 'var(--chart-1)',
          label: type,
        };
      }
      setChartConfig(newChartConfig);

      const chartData = response.history.map((node) => {
        return {
          ...node,
          pops: allBalloonNames.reduce(
            (acc, key) => {
              acc[key] = node.pops[key] || 0;
              return acc;
            },
            {} as Record<BalloonName, number>
          ),
          total: Object.keys(node.pops).reduce((acc, key) => {
            acc += node.pops[key as BalloonName];
            return acc;
          }, 0),
        };
      });
      setData(chartData);
    };

    fetchData();
  }, [props.startDate, props.endDate, props.global]);

  const formatDate = (value: Date | string) =>
    new Date(value).toLocaleDateString(
      'en-US',
      bucket === 'month'
        ? { month: 'short', year: '2-digit', timeZone: 'UTC' }
        : { month: 'short', day: '2-digit', timeZone: 'UTC' }
    );

  const formatTooltipTitle = (value: Date | string) => {
    const start = new Date(value);
    if (bucket === 'day') return formatDate(start);

    const end =
      bucket === 'month'
        ? new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0))
        : new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    const options: Intl.DateTimeFormatOptions =
      start.getUTCFullYear() === end.getUTCFullYear()
        ? { month: 'short', day: '2-digit', timeZone: 'UTC' }
        : {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          };

    return `${start.toLocaleDateString(
      'en-US',
      options
    )} – ${end.toLocaleDateString('en-US', options)}`;
  };

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="ml-[-40px] min-h-[200px] w-[calc(100%+40px)] select-none"
      >
        <BarChart accessibilityLayer data={data}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={true}
            tickMargin={8}
            tickFormatter={formatDate}
          />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip
            labelFormatter={(_, payload) => {
              const date = payload?.[0]?.payload?.date;
              return date ? formatTooltipTitle(date) : null;
            }}
            content={
              <ChartTooltipContent className="capitalize" hideIndicator />
            }
          />
          <CartesianGrid vertical={false} />
          {poppedBalloonTypes.length > 0 &&
            poppedBalloonTypes.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey={`pops.${entry}`}
                name={entry}
                fill="var(--chart-1)"
                stackId="a"
              />
            ))}
        </BarChart>
      </ChartContainer>
    </>
  );
};
