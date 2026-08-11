"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("2026-08-22T12:00:00-03:00"); // Brazil Time (Itupeva/SP)

export default function CountdownTimer() {

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isEventStarted, setIsEventStarted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setIsEventStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-burgundy-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-burgundy-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-burgundy-200 rounded col-span-2"></div>
                <div className="h-2 bg-burgundy-200 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div id="countdown-timer-container" className="flex flex-col items-center justify-center space-y-6">
      {isEventStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-burgundy-800 text-white py-4 px-8 rounded-full shadow-lg font-serif text-2xl tracking-wide animate-pulse"
        >
          O Grande Dia Chegou! 🥳
        </motion.div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center text-white/90 font-serif mb-4 text-sm uppercase tracking-widest drop-shadow-md">
            <span>Faltam somente</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {timeBlocks.map((block, i) => (
              <motion.div
                key={block.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative bg-black/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 sm:p-5 text-center shadow-md flex flex-col justify-center items-center overflow-hidden group hover:border-white/40 hover:bg-black/20 transition-all"
              >
                {/* Decorative Bottom Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <span className="block text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight select-none drop-shadow-md">
                  {block.value.toString().padStart(2, "0")}
                </span>
                
                <span className="block text-[10px] sm:text-xs text-white/70 uppercase tracking-wider mt-1 font-medium select-none">
                  {block.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
