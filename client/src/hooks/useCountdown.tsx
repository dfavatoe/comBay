import { useState, useEffect } from "react";

export function useCountdown(initialMinutes: number) {
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const start = () => setIsActive(true);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isActive,
    start,
    reset,
    formattedTime: formatTime(timeLeft),
  };
}
