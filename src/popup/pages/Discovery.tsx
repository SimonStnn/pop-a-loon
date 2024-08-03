import { ClassValue } from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import * as Balloons from '@/balloons';
import Main from '@/components/Main';
import { BalloonInstance, BalloonName, RemoteResponse } from '@/const';
import remote from '@/remote';
import { cn } from '@/utils';

type Balloon = RemoteResponse['scores']['scores'][0] & {
  balloon: BalloonInstance;
};

const balloons = Object.values(Balloons).sort(
  (a, b) => a.spawn_chance + b.spawn_chance
);
const balloonNames = balloons.map((balloon) => balloon.name) as BalloonName[];

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
    console.log('ref', props.balloon.name);
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
      className={cn('py-4 px-3 flex flex-col items-center', props.className)}
    >
      <div
        ref={balloonRef}
        className={cn(
          'size-16',
          props.count === 0 ? 'brightness-0 opacity-75' : ''
        )}
      />
      <h2 className="text-base font-semibold ">
        {props.count === 0 ? (
          <>???</>
        ) : (
          <>
            {props.name}: {props.count} pops
          </>
        )}
      </h2>
    </div>
  );
};

export default () => {
  const [scores, setScores] = useState<Balloon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await remote.getScores();

      setScores([
        ...balloons.map((balloon) => {
          const score = res.scores.find(
            (score) =>
              score.name.toLocaleLowerCase() === balloon.name.toLowerCase()
          );
          return {
            name: balloon.name as BalloonName,
            count: score?.count || 0,
            balloon: new balloon(),
          };
        }),
        ...new Array(2).fill({
          name: 'default',
          count: 0,
          balloon: new Balloons.Default(),
        } satisfies Balloon),
      ]);
    };
    fetchData();
  }, []);
  return (
    <Main className="h-[286px]">
      <section className="grid grid-cols-2 gap-2">
        {scores.map((score, i) => (
          <Balloon key={i} {...score} className="border rounded" />
        ))}
      </section>
    </Main>
  );
};
