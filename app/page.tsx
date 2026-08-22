"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Clock, Navigation, Heart, ChevronRight, Gift, MessageSquare, Copy, Check, Users, Sparkles, UtensilsCrossed } from "lucide-react";
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
// Removed ElegantRibbonBow

export default function Home() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(TRACK_OPTIONS[0].url);
  const [loading, setLoading] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  // Address Details
  const eventAddress = "Chácara Flavini, R. Tamôio, 790 - Guacuri, Itupeva - SP";
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=R.+Tam%C3%B4io,+790+-+Guacuri,+Itupeva+-+SP";
  const wazeUrl = "https://waze.com/ul?q=R.+Tam%C3%B4io,+790+-+Guacuri,+Itupeva+-+SP&navigate=yes";

  // Fetch initial app state on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/data");
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


  return (
    <main
      className="min-h-screen relative overflow-x-hidden selection:bg-burgundy-200 selection:text-burgundy-950 pb-20 bg-cover bg-fixed bg-center md:bg-left-top bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(80,12,28,0.58) 0%, rgba(114,28,46,0.45) 35%, rgba(95,25,41,0.32) 65%, rgba(80,12,28,0.55) 100%), url('/images/evilyn_bg.png')",
      }}
    >



      {/* Hero Section */}
      <section id="hero-section" className="relative max-w-6xl mx-auto px-4 pt-12 sm:pt-20 pb-12 flex flex-col md:flex-row justify-end items-center">
        {/* Spacer for desktop to keep content strictly over the smooth beige right-side space of the background */}
        <div className="hidden md:block w-[45%] lg:w-[50%]" />

        {/* Right Column: Text directly over background with contrast */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-[55%] lg:w-[50%] p-6 sm:p-8 space-y-6 text-center md:text-left relative z-10"
        >
          <div className="space-y-1 text-center">
            <p className="font-script text-white/95 text-5xl sm:text-6xl tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              Evilyn Albuquerque
            </p>
            
            {/* Grand Headline 18 Anos */}
            <div className="relative inline-block select-none py-1 text-center w-full">
              <span className="block font-serif text-[8.5rem] sm:text-[11.5rem] font-black text-white/90 leading-none tracking-tighter drop-shadow-xl">
                18
              </span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-script text-pink-100 text-5xl sm:text-6xl font-bold rotate-[-6deg] drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
                Anos
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="font-serif text-lg sm:text-xl font-medium text-white/95 tracking-tight leading-relaxed drop-shadow-md">
              Venha celebrar comigo mais um ano de vida!
            </h1>
            
            {/* CRITICAL UPFRONT KIT CHURRASCO EMPHASIS */}
            <div className="inline-flex items-center gap-2 bg-brand-tertiary backdrop-blur-sm text-brand-primary px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md border border-white/40 animate-[bounce_2s_infinite]">
              <UtensilsCrossed className="w-3.5 h-3.5 text-brand-primary" />
              <span>ALMOÇO: Trazer KIT Churrasco</span>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-b border-white/20 py-3.5 max-w-md mx-auto">
            <div className="text-center space-y-0.5">
              <span className="block text-[10px] text-white/70 uppercase tracking-widest font-bold">Horário</span>
              <span className="block text-sm sm:text-base font-serif font-bold text-white drop-shadow-sm">12h00</span>
            </div>
            <div className="text-center space-y-0.5 border-l border-r border-white/20 px-2">
              <span className="block text-[10px] text-white/70 uppercase tracking-widest font-bold">Dia</span>
              <span className="block text-sm sm:text-base font-serif font-bold text-white drop-shadow-sm">22</span>
            </div>
            <div className="text-center space-y-0.5">
              <span className="block text-[10px] text-white/70 uppercase tracking-widest font-bold">Mês</span>
              <span className="block text-sm sm:text-base font-serif font-bold text-white drop-shadow-sm">Agosto</span>
            </div>
          </div>

          <div className="flex items-start gap-2 max-w-sm mx-auto text-white/90 text-xs border-b border-white/20 pb-4">
            <MapPin className="w-5 h-5 text-white/90 shrink-0 mt-0.5 drop-shadow-md" />
            <div className="space-y-1 text-left">
              <p className="font-bold text-white drop-shadow-md">Localização do Evento:</p>
              <p className="font-medium text-[11px] leading-snug drop-shadow-md">{eventAddress}</p>
            </div>
          </div>

          {/* Navigation & Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-1">
            <div className="relative flex-1 rounded-xl p-[2px] overflow-hidden group shadow-[0_0_20px_rgba(242,156,163,0.3)]">
              {/* Rotating light effect border */}
              <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#F29CA3_50%,#ffffff_100%)] opacity-80" />
              <a
                href="#rsvp-section"
                className="relative flex w-full h-full py-3 px-5 bg-black/80 backdrop-blur-md text-brand-tertiary font-black text-xs uppercase tracking-wider rounded-[10px] items-center justify-center gap-2 hover:bg-black/60 transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                <Check className="w-4 h-4" />
                Confirmar Presença
              </a>
            </div>
            <a
              href="#gifts-section"
              className="flex-1 py-3 px-5 bg-black/20 backdrop-blur-sm hover:bg-black/30 border border-white/40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-center"
            >
              <Gift className="w-4 h-4" />
              Dicas de Presente
            </a>
          </div>

          {/* Integrated Countdown Timer */}
          <div className="pt-2 border-t border-white/20">
            <CountdownTimer />
          </div>
        </motion.div>
      </section>

      {/* Schedule/Timeline Section */}
      <section id="timeline-section" className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-script text-white/90 text-4xl drop-shadow-md">Programação</span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white drop-shadow-md">
            Cronograma do Nosso Dia
          </h2>
          <p className="text-white/80 text-sm max-w-md mx-auto drop-shadow-md">
            Preparamos para quem poder chegar cedo, um dia repleto de atrações, boa comida e muita diversão na Chácara Flavini. Venha preparado!
          </p>
        </div>

        <ScheduleTimeline />
      </section>

      {/* Location Routing Section */}
      <section id="location-section" className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8 text-center">
          <div className="space-y-2">
            <MapPin className="w-10 h-10 text-brand-tertiary mx-auto drop-shadow-md" />
            <h2 className="font-serif text-3xl font-bold text-white drop-shadow-md">
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
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold text-sm rounded-xl hover:bg-black/60 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-blue-400" />
              Traçar no Google Maps
            </a>
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-brand-primary/80 backdrop-blur-md border border-brand-tertiary/30 text-white font-bold text-sm rounded-xl hover:bg-brand-primary transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              Traçar no Waze
            </a>
          </div>

          {/* Copiar Endereço Card */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl max-w-sm mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="text-white/90 font-bold truncate text-left">
              {eventAddress}
            </span>
            <button
              onClick={handleCopyAddress}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 border border-white/10"
            >
              {addressCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
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



      {/* RSVP Section */}
      <section id="rsvp-section" className="py-16">
        <RsvpForm rsvps={rsvps} onRsvpSuccess={(updated) => setRsvps(updated)} />
      </section>

      {/* Gift Registry Section */}
      <section id="gifts-section" className="max-w-6xl mx-auto px-4 py-16">
        <GiftRegistry gifts={gifts} onGiftUpdate={(updated) => setGifts(updated)} />
      </section>

      {/* Guestbook Section */}
      <section id="messages-section" className="py-16">
        <Guestbook messages={messages} onMessageSuccess={(updated) => setMessages(updated)} />
      </section>

      {/* Beautiful Footer */}
      <footer className="text-center py-12 text-xs space-y-3 bg-brand-primary/80 backdrop-blur-md border-t border-brand-tertiary/20">
        <p className="font-serif font-semibold text-white/80">
          Convite de Aniversário Digital • Evilyn Albuquerque • 18 Anos
        </p>
        
        <div className="pt-4 max-w-sm mx-auto flex items-center justify-center gap-1.5 text-white/70">
          Feito com muito Amor <Heart className="w-3.5 h-3.5 text-brand-tertiary fill-brand-tertiary animate-pulse" /> por 
          <a href="https://api.whatsapp.com/send?phone=5518996266281" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-brand-tertiary transition-colors ml-0.5">
            Konectaí
          </a>
        </div>
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
