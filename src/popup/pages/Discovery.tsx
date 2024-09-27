import { ClassValue } from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import * as Balloons from '@/balloons';
import Main from '@/components/Main';
import { Skeleton } from '@/components/ui/skeleton';
import { BalloonInstance, BalloonName, RemoteResponse } from '@/const';
import remote from '@/remote';
import { cn } from '@/utils';

type Balloon = RemoteResponse['scores']['scores'][0] & {
  balloon: BalloonInstance;
};

const balloons = Object.values(Balloons).sort(
  (a, b) => a.spawn_chance + b.spawn_chance
);

function removeAnimations(element: HTMLElement) {
  // Remove animation properties from the element
  element.style.animation = 'none';
  element.style.transition = 'none';

  // Recursively remove animations from all child elements
  Array.from(element.children).forEach((child) => {
    removeAnimations(child as HTMLElement);
  });
}

function removeEventListeners(element: HTMLElement) {
  // Clone the element to remove all event listeners
  const clonedElement = element.cloneNode(true) as HTMLElement;

  // Replace the original element with the cloned one
  element.replaceWith(clonedElement);

  // Recursively remove event listeners from all child elements
  Array.from(clonedElement.children).forEach((child) => {
    removeEventListeners(child as HTMLElement);
  });

  return clonedElement;
}

const Balloon = (props: { className?: ClassValue } & Balloon) => {
  const balloonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.balloon.build();
    props.balloon.element.className = '';
    const cleanedElement = removeEventListeners(props.balloon.element);
    removeAnimations(cleanedElement);
    cleanedElement.style.width = '';
    cleanedElement.style.height = cleanedElement.style.width;
    balloonRef.current?.appendChild(cleanedElement);
  }, []);

  return (
    <div
      className={cn('flex flex-col-reverse items-center py-4', props.className)}
    >
      {props.count === 0 ? (
        <h2 className="text-base font-semibold">???</h2>
      ) : (
        <>
          <h2 className="text-sm text-muted-foreground">
            <span className="capitalize">{props.name}</span> balloon
          </h2>
          <p className="text-base font-semibold">
            <>
              {props.count} {props.count === 1 ? 'pop' : 'pops'}
            </>
          </p>
        </>
      )}
      <div
        ref={balloonRef}
        className={cn(
          'size-16',
          props.count === 0 ? 'opacity-75 brightness-0' : ''
        )}
      />
    </div>
  );
};

export default () => {
  const [scores, setScores] = useState<Balloon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await remote.getScores();

      setScores([
        ...balloons.map((balloon) => {
          const score = res.scores.find(
            (score) =>
              score.name.toLocaleLowerCase() ===
              new balloon().name.toLowerCase()
          );
          return {
            name: score?.name as BalloonName,
            count: score?.count || 0,
            balloon: new balloon(),
          };
        }),
        ...new Array(1).fill({
          name: 'default',
          count: 0,
          balloon: new Balloons.Default(),
        } satisfies Balloon),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <Main className="h-[350px]">
      <section className="grid grid-cols-2 gap-2">
        {isLoading
          ? Array(6)
              .fill(1)
              .map((_, i) => <Skeleton key={i} className="h-36" />)
          : scores.map((score, i) => (
              <Balloon key={i} {...score} className="rounded border" />
            ))}
      </section>
    </Main>
  );
};
