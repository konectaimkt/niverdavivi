"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const CAROUSEL_SLIDES = [
  {
    src: "/images/evilyn_portrait.jpg",
    alt: "Evilyn Albuquerque - Retrato de 18 anos",
    title: "Evilyn Albuquerque",
    tagline: "Vivendo a melhor fase • 18 Anos",
  },
  {
    src: "/images/evilyn_outdoor.jpg",
    alt: "Evilyn Albuquerque - Comemoração ao ar livre",
    title: "Celebrando a Vida",
    tagline: "Momentos especiais cercada de natureza e amor",
  },
  {
    src: "/images/evilyn_cake.jpg",
    alt: "Evilyn Albuquerque - Soprando as velinhas de aniversário",
    title: "Que comece o novo ciclo!",
    tagline: "Gratidão por cada aprendizado e sorriso",
  },
];

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideLeft = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const setSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Variants for animation
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div id="photo-carousel-container" className="max-w-md mx-auto px-4 py-2">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-burgundy-800/10 bg-neutral-100 group">
        
        {/* Slide Content with AnimatePresence */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
              className="absolute inset-0"
            >
              {/* Image */}
              <img
                src={CAROUSEL_SLIDES[currentIndex].src}
                alt={CAROUSEL_SLIDES[currentIndex].alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Sophisticated Dark Gradient Overlay from bottom */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Floating Heart Icon Accent */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white shadow-sm">
                <Heart className="w-5 h-5 fill-burgundy-400 stroke-burgundy-500 animate-pulse" />
              </div>

              {/* Text Information card aligned on the bottom */}
              <div className="absolute bottom-6 inset-x-6 text-white text-center space-y-1">
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  {CAROUSEL_SLIDES[currentIndex].title}
                </h3>
                <p className="text-neutral-200 text-xs tracking-wider uppercase">
                  {CAROUSEL_SLIDES[currentIndex].tagline}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Chevrons */}
        <button
          onClick={slideLeft}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 active:scale-95 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={slideRight}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 active:scale-95 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Index indicator dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-burgundy-800" : "w-2 bg-burgundy-800/20 hover:bg-burgundy-800/40"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
