import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate = '2026-09-20T00:00:00' }: { targetDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex space-x-4 font-mono text-center">
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-color-red">{pad(timeLeft.days)}</span>
        <span className="text-xs text-text-muted">DAYS</span>
      </div>
      <span className="text-3xl text-color-silver">:</span>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-white">{pad(timeLeft.hours)}</span>
        <span className="text-xs text-text-muted">HOURS</span>
      </div>
      <span className="text-3xl text-color-silver">:</span>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-white">{pad(timeLeft.minutes)}</span>
        <span className="text-xs text-text-muted">MINS</span>
      </div>
      <span className="text-3xl text-color-silver">:</span>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-color-danger animate-pulse">{pad(timeLeft.seconds)}</span>
        <span className="text-xs text-text-muted">SECS</span>
      </div>
    </div>
  );
};
