"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Users, Check, AlertCircle, Heart } from "lucide-react";
import { RSVP } from "../app/api/data/route";

interface RsvpFormProps {
  rsvps: RSVP[];
  onRsvpSuccess: (updatedRsvps: RSVP[]) => void;
}

export default function RsvpForm({ rsvps, onRsvpSuccess }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [companionOption, setCompanionOption] = useState<string>("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || confirmed === null) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Map companion option to count for the database
      let count = 0;
      if (companionOption === "Eu e Esposa" || companionOption === "Eu e Esposo") count = 1;
      else if (companionOption === "Eu e minha casa") count = 3;

      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rsvp",
          payload: {
            name: name,
            phone: city, // reusing phone field in DB to store city temporarily
            confirmed,
            companionsCount: count,
            message,
          },
        }),
      });

      if (response.ok) {
        const updatedState = await response.json();
        onRsvpSuccess(updatedState.rsvps);
        setSubmitStatus("success");
        
        // Trigger WhatsApp redirection with Brazil country code 55
        const whatsappPhone = "5515988295630";
        const rsvpStatus = confirmed ? "Sim, eu vou!" : "Não poderei ir";
        const companionsText = confirmed && companionOption ? `\nAcompanhantes: ${companionOption}` : "";
        const cityText = city.trim() ? `\nCidade: ${city.trim()}` : "";
        const messageText = message.trim() ? `\n\nRecado: "${message.trim()}"` : "";
        
        const textMessage = `Olá Evilyn! Confirmei minha presença pelo site do seu aniversário!\n\nNome: ${name.trim()}${cityText}\nPresença: ${rsvpStatus}${companionsText}${messageText}`;
        const encodedText = encodeURIComponent(textMessage);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedText}`;
        
        // Open WhatsApp in a new tab/window
        window.open(whatsappUrl, "_blank");
        
        // Reset form
        setName("");
        setCity("");
        setConfirmed(null);
        setCompanionOption("");
        setMessage("");
        
        // Auto reset status message after 4 seconds
        setTimeout(() => setSubmitStatus(null), 4000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter confirmed guests
  const confirmedList = rsvps.filter((r) => r.confirmed);
  const totalGuests = confirmedList.reduce((acc, curr) => acc + 1 + curr.companionsCount, 0);

  return (
    <div id="rsvp-container" className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 py-4">
      
      {/* RSVP Form Column */}
      <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 text-white">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-bold text-white">
            Confirme sua Presença
          </h3>
          <p className="text-white/70 text-sm">
            Sua presença tornará esse dia inesquecível! Por favor, confirme até o dia 15 de Agosto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              Nome *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:border-brand-tertiary focus:ring-1 focus:ring-brand-tertiary focus:outline-none transition-all text-sm text-white placeholder-white/40"
            />
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Itupeva, SP"
              className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:border-brand-tertiary focus:ring-1 focus:ring-brand-tertiary focus:outline-none transition-all text-sm text-white placeholder-white/40"
            />
          </div>

          {/* Confirmed Choice Button Toggles */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              Você irá ao evento? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all text-sm cursor-pointer ${
                  confirmed === true
                    ? "bg-emerald-500/90 hover:bg-emerald-600/90 text-white border-emerald-500 shadow-md"
                    : "bg-black/20 hover:bg-black/40 text-white/90 border-white/20"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Sim, eu vou!
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  setCompanionOption("");
                }}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all text-sm cursor-pointer ${
                  confirmed === false
                    ? "bg-red-500/90 hover:bg-red-600/90 text-white border-red-500 shadow-md"
                    : "bg-black/20 hover:bg-black/40 text-white/90 border-white/20"
                }`}
              >
                <XCircle className="w-5 h-5" />
                Não poderei ir
              </button>
            </div>
          </div>

          {/* Companions Options (Only active if Confirmed = True) */}
          <AnimatePresence>
            {confirmed === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-2"
              >
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-3">
                  <div className="text-sm text-white/90 font-medium flex items-center gap-1.5 mb-2">
                    <Users className="w-4 h-4" />
                    Quem vai com você?
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Vai só Eu", emoji: "👤" },
                      { label: "Eu e Esposa", emoji: "👫" },
                      { label: "Eu e Esposo", emoji: "👫" },
                      { label: "Eu e minha casa", emoji: "👨‍👩‍👧‍👦" }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setCompanionOption(opt.label)}
                        className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          companionOption === opt.label
                            ? "bg-brand-primary text-brand-tertiary border-brand-primary shadow-sm"
                            : "bg-black/20 text-white/80 hover:bg-black/40 border-white/20"
                        }`}
                      >
                        <span className="text-base">{opt.emoji}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optional Message */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              Recado para a Aniversariante
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe um carinho, parabéns ou aviso legal sobre restrições"
              className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:border-brand-tertiary focus:ring-1 focus:ring-brand-tertiary focus:outline-none transition-all text-sm text-white placeholder-white/40 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className={`relative w-full rounded-xl p-[2px] overflow-hidden group shadow-[0_0_15px_rgba(242,156,163,0.5)] ${
            confirmed === null ? "opacity-50 cursor-not-allowed" : ""
          }`}>
            {/* Rotating light effect border (only spins if confirmed) */}
            <div className={`absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#F29CA3_50%,#ffffff_100%)] opacity-80 ${
              confirmed !== null ? "animate-[spin_3s_linear_infinite]" : ""
            }`} />
            
            <button
              type="submit"
              disabled={isSubmitting || confirmed === null}
              className={`relative w-full py-3 px-6 rounded-[10px] text-brand-tertiary font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                confirmed === null
                  ? "bg-neutral-800/50 cursor-not-allowed"
                  : isSubmitting
                  ? "bg-black/90 opacity-85 cursor-wait"
                  : "bg-black/80 hover:bg-black/60 active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-tertiary/30 border-t-brand-tertiary rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Confirmação"
              )}
            </button>
          </div>
        </form>

        {/* Feedback Messages */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium"
            >
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Sua presença foi enviada com sucesso! Obrigado por confirmar. ❤️</span>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>Ocorreu um erro ao enviar sua confirmação. Tente novamente.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guest List Column */}
      <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl text-white flex flex-col h-[400px] lg:h-auto">
        <div className="text-center pb-4 border-b border-white/10 space-y-1.5">
          <div className="flex justify-center items-center gap-1.5 text-white font-serif font-bold text-lg">
            <Heart className="w-4 h-4 text-brand-tertiary fill-brand-tertiary" />
            <h3>Lista de Confirmados</h3>
          </div>
          <p className="text-white/70 text-xs font-semibold">
            {totalGuests} {totalGuests === 1 ? "presença confirmada" : "presenças confirmadas"}
          </p>
        </div>

        {/* Guest scroll area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
          {confirmedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/40 space-y-2">
              <Users className="w-8 h-8 opacity-40" />
              <p className="text-xs">Seja o primeiro a confirmar sua presença!</p>
            </div>
          ) : (
            confirmedList.map((rsvp, index) => (
              <motion.div
                key={rsvp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 1) }}
                className="flex items-center justify-between p-3.5 bg-black/20 border border-white/10 rounded-xl"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">
                    {rsvp.name}
                  </p>
                  <p className="text-[10px] text-white/50 font-medium">
                    {new Date(rsvp.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-brand-primary/80 text-brand-tertiary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  <Users className="w-3.5 h-3.5" />
                  <span>{1 + rsvp.companionsCount} {1 + rsvp.companionsCount === 1 ? "Pessoa" : "Pessoas"}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
