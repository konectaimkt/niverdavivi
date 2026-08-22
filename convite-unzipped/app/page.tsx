"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Clock, Navigation, Heart, ChevronRight, Gift, MessageSquare, Copy, Check, Users, Sparkles } from "lucide-react";
import MusicPlayer, { TRACK_OPTIONS } from "../components/MusicPlayer";
import CountdownTimer from "../components/CountdownTimer";
import ScheduleTimeline from "../components/ScheduleTimeline";
import PhotoCarousel from "../components/PhotoCarousel";
import RsvpForm from "../components/RsvpForm";
import GiftRegistry from "../components/GiftRegistry";
import Guestbook from "../components/Guestbook";
import AdminPanel from "../components/AdminPanel";
import { RSVP, Message, Gift as GiftType } from "./api/data/route";

// Sophisticated custom SVG bow to match the user's reference image
function ElegantRibbonBow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central Knot */}
      <ellipse cx="100" cy="80" rx="16" ry="12" fill="#5f1929" />
      <ellipse cx="100" cy="80" rx="12" ry="8" fill="#721c2e" />
      
      {/* Left Loop */}
      <path
        d="M100,80 C60,20 10,40 10,75 C10,105 70,105 100,80 Z"
        fill="#721c2e"
        stroke="#5f1929"
        strokeWidth="1.5"
      />
      <path
        d="M100,80 C70,35 30,50 30,75 C30,95 70,95 100,80 Z"
        fill="#8e283e"
        opacity="0.8"
      />

      {/* Right Loop */}
      <path
        d="M100,80 C140,20 190,40 190,75 C190,105 130,105 100,80 Z"
        fill="#721c2e"
        stroke="#5f1929"
        strokeWidth="1.5"
      />
      <path
        d="M100,80 C130,35 170,50 170,75 C170,95 130,95 100,80 Z"
        fill="#8e283e"
        opacity="0.8"
      />

      {/* Left Ribbon Tail */}
      <path
        d="M95,85 C70,110 50,150 55,190 C45,190 35,170 45,140 C55,110 85,90 95,85 Z"
        fill="#721c2e"
      />
      <path
        d="M95,85 C75,108 58,145 61,180 C57,180 48,165 53,138 C58,111 85,90 95,85 Z"
        fill="#8e283e"
        opacity="0.7"
      />

      {/* Right Ribbon Tail */}
      <path
        d="M105,85 C130,110 150,150 145,190 C155,190 165,170 155,140 C145,110 115,90 105,85 Z"
        fill="#721c2e"
      />
      <path
        d="M105,85 C125,108 142,145 139,180 C143,180 152,165 147,138 C142,111 115,90 105,85 Z"
        fill="#8e283e"
        opacity="0.7"
      />
    </svg>
  );
}

export default function Home() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(TRACK_OPTIONS[0].url);
  const [loading, setLoading] = useState(true);
  const [addressCopied, setAddressCopied] = useState(false);

  // Address Details
  const eventAddress = "Chácara Flavini, R. Tamôio, 790 - Guacuri, Itupeva - SP";
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=R.+Tam%C3%B4io,+790+-+Guacuri,+Itupeva+-+SP";
  const wazeUrl = "https://waze.com/ul?q=R.+Tam%C3%B4io,+790+-+Guacuri,+Itupeva+-+SP&navigate=yes";

  // Fetch initial app state on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/app/api/data");
        if (res.ok) {
          const data = await res.json();
          setRsvps(data.rsvps || []);
          setMessages(data.messages || []);
          setGifts(data.gifts || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(eventAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-bg text-burgundy-800 space-y-4">
        <div className="w-12 h-12 border-4 border-burgundy-200 border-t-burgundy-800 rounded-full animate-spin" />
        <p className="font-serif text-sm tracking-widest uppercase animate-pulse">
          Carregando Convite Especial...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-burgundy-200 selection:text-burgundy-950 pb-20 bg-[url('/images/evilyn_bg.jpg')] bg-cover bg-fixed bg-center md:bg-left-top bg-no-repeat">
      
      {/* Decorative Ribbon Bow - Top Left (Large like reference) */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-48 sm:w-64 md:w-80 text-burgundy-800 z-10 pointer-events-none select-none">
        <ElegantRibbonBow />
      </div>

      {/* Decorative Ribbon Bow - Bottom Right (Subtle like reference) */}
      <div className="absolute bottom-10 right-0 translate-x-1/3 w-32 sm:w-44 text-burgundy-800/80 z-10 pointer-events-none select-none">
        <ElegantRibbonBow />
      </div>

      {/* Hero Section */}
      <section id="hero-section" className="relative max-w-6xl mx-auto px-4 pt-12 sm:pt-20 pb-12 flex flex-col md:flex-row justify-end items-center">
        {/* Spacer for desktop to keep content strictly over the smooth beige right-side space of the background */}
        <div className="hidden md:block w-[45%] lg:w-[50%]" />

        {/* Right Column: High-contrast elegant translucent card for extreme legibility over background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-[55%] lg:w-[50%] bg-white/92 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/60 space-y-6 text-center md:text-left relative z-10"
        >
          <div className="space-y-1 text-center">
            <p className="font-script text-burgundy-800 text-4xl sm:text-5xl tracking-wide select-none">
              Evilyn Albuquerque
            </p>
            
            {/* Grand Headline 18 Anos */}
            <div className="relative inline-block select-none py-1 text-center w-full">
              <span className="block font-serif text-[8.5rem] sm:text-[11.5rem] font-black text-burgundy-900 leading-none tracking-tighter">
                18
              </span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-script text-burgundy-800 text-5xl sm:text-6xl font-bold rotate-[-6deg] drop-shadow-[0_3px_5px_rgba(255,255,255,0.9)]">
                Anos
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-neutral-800 tracking-tight leading-relaxed">
              Venha celebrar comigo mais um maravilhoso ano de vida!
            </h1>
            
            {/* CRITICAL UPFRONT KIT CHURRASCO EMPHASIS */}
            <div className="inline-flex items-center gap-2 bg-burgundy-800 text-white px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md border border-white/10 animate-[bounce_2s_infinite]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Almoço: KIT CHURRASCO incluso!</span>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-b border-burgundy-800/10 py-3.5 max-w-md mx-auto">
            <div className="text-center space-y-0.5">
              <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Horário</span>
              <span className="block text-sm sm:text-base font-serif font-black text-burgundy-800">12:00h</span>
            </div>
            <div className="text-center space-y-0.5 border-l border-r border-burgundy-800/10 px-2">
              <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Dia</span>
              <span className="block text-sm sm:text-base font-serif font-black text-burgundy-800">22</span>
            </div>
            <div className="text-center space-y-0.5">
              <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Mês</span>
              <span className="block text-sm sm:text-base font-serif font-black text-burgundy-800">Agosto</span>
            </div>
          </div>

          <div className="flex items-start gap-2 max-w-sm mx-auto text-neutral-600 text-xs border-b border-burgundy-800/10 pb-4">
            <MapPin className="w-5 h-5 text-burgundy-800 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="font-bold text-neutral-800">Localização do Evento:</p>
              <p className="font-semibold text-[11px] leading-snug">{eventAddress}</p>
            </div>
          </div>

          {/* Navigation & Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-1">
            <a
              href="#rsvp-section"
              className="flex-1 py-3 px-5 bg-burgundy-800 hover:bg-burgundy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-center"
            >
              <Check className="w-4 h-4" />
              Confirmar Presença
            </a>
            <a
              href="#gifts-section"
              className="flex-1 py-3 px-5 bg-white hover:bg-neutral-50 border border-burgundy-800/30 text-burgundy-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-center"
            >
              <Gift className="w-4 h-4" />
              Dicas de Presente
            </a>
          </div>

          {/* Integrated Countdown Timer */}
          <div className="pt-2 border-t border-neutral-100">
            <CountdownTimer />
          </div>
        </motion.div>
      </section>

      {/* Schedule/Timeline Section */}
      <section id="timeline-section" className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-script text-burgundy-800 text-3xl">Programação</span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">
            Cronograma do Nosso Dia
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Preparamos um dia completo repleto de atrações, boa comida e muita diversão na Chácara Flavini. Venha preparado!
          </p>
        </div>

        <ScheduleTimeline />
      </section>

      {/* Location Routing Section */}
      <section id="location-section" className="bg-white/60 border-t border-b border-burgundy-800/10 py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8 text-center">
          <div className="space-y-2">
            <MapPin className="w-10 h-10 text-burgundy-800 mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-neutral-900">
              Como Chegar na Chácara Flavini
            </h2>
            <p className="text-white/80 text-sm max-w-md mx-auto drop-shadow-md">
              A Chácara Flavini fica em Itupeva, interior de SP, em um local de fácil acesso. Use os links abaixo para traçar sua rota em tempo real!
            </p>
          </div>

          {/* Interactive Routing Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-white border border-neutral-200 text-neutral-700 font-bold text-sm rounded-xl hover:bg-neutral-50 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              Traçar no Google Maps
            </a>
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-burgundy-800 text-white font-bold text-sm rounded-xl hover:bg-burgundy-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              Traçar no Waze
            </a>
          </div>

          {/* Copiar Endereço Card */}
          <div className="bg-white p-4 rounded-xl border border-burgundy-100 shadow-sm max-w-sm mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="text-neutral-600 font-bold truncate text-left">
              {eventAddress}
            </span>
            <button
              onClick={handleCopyAddress}
              className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1"
            >
              {addressCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Profile & Photos Carousel Section */}
      <section id="photos-section" className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-script text-burgundy-800 text-3xl">Galeria</span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">
            Sobre a Evilyn
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Uma recordação especial da nossa debutante completando seus sonhados 18 anos de vida, alegria e conquistas.
          </p>
        </div>

        <PhotoCarousel />
      </section>

      {/* RSVP Section */}
      <section id="rsvp-section" className="bg-white/40 border-t border-b border-burgundy-800/10 py-16">
        <RsvpForm rsvps={rsvps} onRsvpSuccess={(updated) => setRsvps(updated)} />
      </section>

      {/* Gift Registry Section */}
      <section id="gifts-section" className="max-w-6xl mx-auto px-4 py-16">
        <GiftRegistry gifts={gifts} onGiftUpdate={(updated) => setGifts(updated)} />
      </section>

      {/* Guestbook Section */}
      <section id="messages-section" className="bg-white/40 border-t border-b border-burgundy-800/10 py-16">
        <Guestbook messages={messages} onMessageSuccess={(updated) => setMessages(updated)} />
      </section>

      {/* Beautiful Footer */}
      <footer className="text-center py-12 text-xs text-neutral-400 space-y-2">
        <p className="font-serif font-semibold text-neutral-500">
          Convite de Aniversário Digital • Evilyn Albuquerque • 18 Anos
        </p>
        <p>Desenvolvido com carinho para celebrar a vida. 🌸</p>
      </footer>

      {/* Background Music Player Floating controller */}
      <MusicPlayer currentTrackUrl={currentTrackUrl} onTrackUrlChange={(url) => setCurrentTrackUrl(url)} />

      {/* Admin Panel Floating lock controller */}
      <AdminPanel
        rsvps={rsvps}
        messages={messages}
        gifts={gifts}
        currentTrackUrl={currentTrackUrl}
        onTrackUrlChange={(url) => {
          setCurrentTrackUrl(url);
        }}
        onRsvpUpdate={(updated) => setRsvps(updated)}
        onMessageUpdate={(updated) => setMessages(updated)}
        onGiftUpdate={(updated) => setGifts(updated)}
      />
    </main>
  );
}
