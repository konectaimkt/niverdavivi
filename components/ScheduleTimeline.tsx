"use client";

import React from "react";
import { motion } from "motion/react";
import { Coffee, Flame, UtensilsCrossed, Cake, Music, Award, Disc, Sun } from "lucide-react";

interface TimelineItem {
  time: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  important?: boolean;
}

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    time: "08h00",
    title: "Café da Manhã Comunitário",
    description: "Inicie o dia conosco! Traga seu Kit Café da Manhã para fazermos juntos um delicioso Café da Manhã. Pode ser um prato de salgado, bolo simples, refrigerante ou suco.",
    icon: Coffee,
  },
  {
    time: "09h00",
    title: "Futebol & Mesa de Pimbolim Liberado",
    description: "Momento de descontração e lazer! O campo de futebol e a nossa mesa de pimbolim estarão totalmente liberados quem quiser se divertir.",
    icon: Flame,
  },
  {
    time: "12h00",
    title: "Almoço - Kit Churrasco",
    description: "Traga seu Kit Churrasco! Vamos juntos fazer aquele churrasco maravilhoso comunitário.",
    icon: UtensilsCrossed,
    important: true,
  },
  {
    time: "14h30",
    title: "O Clássico Parabéns",
    description: "Hora de cantar o parabéns oficial para comemorar os tão esperados 18 anos! Momento do bolo e muita alegria.",
    icon: Cake,
  },
  {
    time: "15h00",
    title: "Tocatta Musical",
    description: "Traga seus instrumentos e agora é hora dos tocador fazer aquela tocatta maravilhosa.",
    icon: Music,
  },
  {
    time: "16h30",
    title: "Roda de Violão",
    description: "Hora da Roda de violão, com contrabaixo, violinos, ukulele e muito canto!",
    icon: Disc,
  }
];

export default function ScheduleTimeline() {
  return (
    <div id="schedule-timeline-container" className="relative max-w-2xl mx-auto px-4 py-6">
      {/* Centered Timeline vertical bar */}
      <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-[2px] bg-burgundy-800/20 md:-translate-x-1/2" />

      <div className="space-y-8">
        {TIMELINE_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col md:flex-row items-stretch md:items-center relative ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Icon Container (positioned on timeline) */}
              <div className="absolute left-8 md:left-1/2 w-10 h-10 -translate-x-1/2 flex items-center justify-center rounded-full border z-10 transition-all duration-300 shadow-xl bg-black/60 border-brand-tertiary/30 text-brand-tertiary backdrop-blur-md">
                <Icon className={`w-5 h-5 ${item.important ? "text-amber-300 animate-pulse" : ""}`} />
              </div>

              {/* Time Label (Desktop: opposing side, Mobile: above card) */}
              <div className={`pl-16 md:pl-0 w-full md:w-1/2 flex ${
                isEven ? "md:justify-start md:pr-12" : "md:justify-end md:pl-12"
              } mb-2 md:mb-0`}>
                <span className="font-serif text-xl font-bold text-brand-tertiary bg-black/50 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                  {item.time}
                </span>
              </div>

              {/* Card Container */}
              <div className={`pl-16 md:pl-0 w-full md:w-1/2 ${
                isEven ? "md:pl-12" : "md:pr-12"
              }`}>
                <div
                  className={`p-6 rounded-2xl border transition-all shadow-xl backdrop-blur-md relative overflow-hidden ${
                    item.important
                      ? "bg-brand-primary/80 border-brand-tertiary/50 text-white scale-[1.03] md:scale-[1.05]"
                      : "bg-black/40 border-white/20 hover:border-white/40 text-white"
                  }`}
                >
                  {/* Subtle decorative ribbon corner for important events */}
                  {item.important && (
                    <div className="absolute top-0 right-0 bg-amber-400 text-burgundy-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                      Destaque Almoço
                    </div>
                  )}

                  <h3 className={`text-lg font-bold font-serif mb-2 ${
                    item.important ? "text-brand-tertiary" : "text-white"
                  }`}>
                    {item.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    item.important ? "text-white/90" : "text-white/70"
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
