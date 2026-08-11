"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, Music2, Volume2, VolumeX, Play, Pause, Disc } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MusicPlayerProps {
  currentTrackUrl: string;
  onTrackUrlChange: (url: string) => void;
}

export const TRACK_OPTIONS = [
  { name: "Não Vai Mais Chorar Vivi (Padrão)", url: "/NAO-VAI-MAIS-CHORAR-VIVI.mp3" },
  { name: "Violão Acústico Suave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { name: "Melodia Romântica de Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

export default function MusicPlayer({ currentTrackUrl, onTrackUrlChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize audio source and autoplay attempt when splash is accepted
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrackUrl;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackUrl]);

  const handleEnterWithMusic = () => {
    setShowSplash(false);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = currentTrackUrl;
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => {
          setError(null);
        })
        .catch((err) => {
          console.error("Play failed:", err);
          setError("Clique no botão de play para ouvir a música.");
          setIsPlaying(false);
        });
    }
  };

  const handleEnterWithoutMusic = () => {
    setShowSplash(false);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setError(null);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Play toggle failed:", err);
          setError("Erro ao reproduzir. Verifique a conexão ou o link da música.");
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        className="hidden"
        onError={() => setError("Música indisponível ou link inválido")}
      />

      {/* Elegant Welcoming Overlay Dialog to handle Browser Autoplay policies */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            id="music-splash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/90 backdrop-blur-md"
          >
            <motion.div
              id="music-splash-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-[#EDEDE8] border border-burgundy-800/20 p-8 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden"
            >
              {/* Elegant Ribbon Frame Accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-burgundy-600 via-burgundy-800 to-burgundy-600" />
              
              <div className="mx-auto w-16 h-16 bg-burgundy-50 rounded-full flex items-center justify-center text-burgundy-800 animate-pulse">
                <Music className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p className="font-script text-burgundy-800 text-4xl">Convite de 18 Anos</p>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">
                  Evilyn Albuquerque
                </h2>
                <p className="text-neutral-600 text-sm max-w-xs mx-auto">
                  Este convite contém uma música de fundo especial. Deseja iniciar a experiência com música?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="btn-enter-with-music"
                  onClick={handleEnterWithMusic}
                  className="flex-1 py-3 px-6 bg-burgundy-800 text-white rounded-xl font-medium hover:bg-burgundy-900 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  Sim, com música
                </button>
                <button
                  id="btn-enter-without-music"
                  onClick={handleEnterWithoutMusic}
                  className="flex-1 py-3 px-6 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded-xl font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  Sem música
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controller Widget */}
      <div
        id="music-floating-widget"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
      >
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-burgundy-200 shadow-md flex items-center gap-2 text-xs text-burgundy-800 font-medium max-w-xs"
            >
              <div className="flex items-center gap-0.5 h-3">
                <div className="w-0.5 h-full bg-burgundy-800 rounded-full animate-[bounce_0.8s_infinite_100ms]" />
                <div className="w-0.5 h-full bg-burgundy-800 rounded-full animate-[bounce_0.8s_infinite_300ms]" />
                <div className="w-0.5 h-full bg-burgundy-800 rounded-full animate-[bounce_0.8s_infinite_200ms]" />
                <div className="w-0.5 h-full bg-burgundy-800 rounded-full animate-[bounce_0.8s_infinite_400ms]" />
              </div>
              <span className="truncate">Tocando melodia de fundo...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* Volume Control Slider (Appears on hover of the player) */}
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-burgundy-100 p-2 py-3 flex flex-col items-center gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 h-28 hidden md:flex">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="accent-burgundy-800 h-16 cursor-pointer -rotate-90 origin-center my-2"
              title="Volume"
            />
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-400 cursor-pointer" onClick={toggleMute} />
            ) : (
              <Volume2 className="w-4 h-4 text-burgundy-800 cursor-pointer" onClick={toggleMute} />
            )}
          </div>

          {/* Master Play/Pause Button */}
          <button
            id="btn-music-toggle"
            onClick={togglePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-burgundy-800 focus:ring-offset-2 ${
              isPlaying
                ? "bg-burgundy-800 text-white border-burgundy-800 hover:bg-burgundy-900"
                : "bg-white text-burgundy-800 border-burgundy-200 hover:bg-burgundy-50"
            }`}
            title={isPlaying ? "Pausar música" : "Tocar música"}
          >
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="flex items-center justify-center"
              >
                <Disc className="w-6 h-6" />
              </motion.div>
            ) : (
              <Play className="w-6 h-6 translate-x-0.5" />
            )}

            {/* Ripple effect when paused */}
            {!isPlaying && (
              <span className="absolute inset-0 rounded-full bg-burgundy-800/20 animate-ping pointer-events-none" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg text-xs font-medium max-w-[200px] text-right shadow-sm">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
