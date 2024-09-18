import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BalloonName, HistoryNode } from '@/const';
import remote from '@/remote';

export default (props: { startDate: Date; endDate: Date }) => {
  const [data, setData] = useState({} as (HistoryNode & { total: number })[]);
  const [poppedBalloonTypes, setPoppedBalloonTypes] = useState<BalloonName[]>(
    []
  );
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await remote.getPopHistory(
        props.startDate,
        props.endDate
      );

      const allBalloonNames = [
        ...new Set(
          response.history
            .map((node) => Object.keys(node.pops) as BalloonName[])
            .flat()
        ),
      ];

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
  }, [props.startDate, props.endDate]);

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
            tickFormatter={(value: Date) =>
              value.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
              })
            }
          />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip
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
