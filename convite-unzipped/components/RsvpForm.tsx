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
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [companionsCount, setCompanionsCount] = useState(0);
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || confirmed === null) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/app/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rsvp",
          payload: {
            name,
            phone,
            confirmed,
            companionsCount,
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
        const companionsText = confirmed && companionsCount > 0 ? ` (+${companionsCount} acompanhantes)` : "";
        const contactPhone = phone.trim() ? `\nWhatsApp/Celular: ${phone.trim()}` : "";
        const messageText = message.trim() ? `\n\nRecado: "${message.trim()}"` : "";
        
        const textMessage = `Olá Evilyn! Confirmei minha presença pelo site do seu aniversário!\n\nNome: ${name.trim()}${contactPhone}\nPresença: ${rsvpStatus}${companionsText}${messageText}`;
        const encodedText = encodeURIComponent(textMessage);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedText}`;
        
        // Open WhatsApp in a new tab/window
        window.open(whatsappUrl, "_blank");
        
        // Reset form
        setName("");
        setPhone("");
        setConfirmed(null);
        setCompanionsCount(0);
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
      <div className="bg-white border border-burgundy-800/10 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-bold text-neutral-900">
            Confirme sua Presença
          </h3>
          <p className="text-neutral-500 text-sm">
            Sua presença tornará esse dia inesquecível! Por favor, confirme até o dia 15 de Agosto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 focus:outline-none transition-all text-sm text-neutral-900"
            />
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              WhatsApp / Celular
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 focus:outline-none transition-all text-sm text-neutral-900"
            />
          </div>

          {/* Confirmed Choice Button Toggles */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Você irá ao evento? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all text-sm cursor-pointer ${
                  confirmed === true
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-md"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Sim, eu vou!
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  setCompanionsCount(0);
                }}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all text-sm cursor-pointer ${
                  confirmed === false
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-md"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200"
                }`}
              >
                <XCircle className="w-5 h-5" />
                Não poderei ir
              </button>
            </div>
          </div>

          {/* Companions Counter Slider/Select (Only active if Confirmed = True) */}
          <AnimatePresence>
            {confirmed === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-2"
              >
                <div className="p-4 bg-burgundy-50/50 border border-burgundy-100 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-sm text-burgundy-900 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      Acompanhantes extras?
                    </span>
                    <span className="bg-burgundy-800 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {companionsCount === 0 ? "Nenhum" : `+ ${companionsCount}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setCompanionsCount(count)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          companionsCount === count
                            ? "bg-burgundy-800 text-white border-burgundy-800 shadow-sm"
                            : "bg-white text-neutral-600 hover:bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-burgundy-800/70">
                    Acompanhantes incluem familiares ou amigos próximos convidados.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optional Message */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Recado para a Aniversariante
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe um carinho, parabéns ou aviso legal sobre restrições"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 focus:outline-none transition-all text-sm text-neutral-900 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || confirmed === null}
            className={`w-full py-3 px-6 rounded-xl text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              confirmed === null
                ? "bg-neutral-400 cursor-not-allowed"
                : isSubmitting
                ? "bg-burgundy-700 opacity-85 cursor-wait"
                : "bg-burgundy-800 hover:bg-burgundy-900 active:scale-[0.99]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando Confirmação...
              </>
            ) : (
              "Enviar Confirmação"
            )}
          </button>
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
      <div className="bg-white border border-burgundy-800/10 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col h-[400px] lg:h-auto">
        <div className="text-center pb-4 border-b border-neutral-100 space-y-1.5">
          <div className="flex justify-center items-center gap-1.5 text-burgundy-800 font-serif font-bold text-lg">
            <Heart className="w-4 h-4 fill-burgundy-800" />
            <h3>Lista de Confirmados</h3>
          </div>
          <p className="text-neutral-500 text-xs font-semibold">
            {totalGuests} {totalGuests === 1 ? "presença confirmada" : "presenças confirmadas"}
          </p>
          <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold py-1 px-3 rounded-full inline-block mt-1 border border-emerald-100 leading-tight">
            Confirme ao lado: somente quem der &quot;Sim, eu vou!&quot; aparecerá aqui
          </div>
        </div>

        {/* Guest scroll area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
          {confirmedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 space-y-2">
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
                className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-100 rounded-xl"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                    {rsvp.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    {new Date(rsvp.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-burgundy-50 text-burgundy-800 text-xs font-bold px-2.5 py-1 rounded-full">
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
