"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Check, Sparkles, User, MessageSquareCode } from "lucide-react";
import { Message } from "../app/api/data/route";

interface GuestbookProps {
  messages: Message[];
  onMessageSuccess: (updatedMessages: Message[]) => void;
}

export default function Guestbook({ messages, onMessageSuccess }: GuestbookProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          payload: { name, text },
        }),
      });

      if (response.ok) {
        const updatedState = await response.json();
        onMessageSuccess(updatedState.messages);
        
        // Reset form
        setName("");
        setText("");
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4500);
      }
    } catch (error) {
      console.error("Failed to post message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="guestbook-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4 py-4">
      
      {/* Leave Message Form Card */}
      <div className="lg:col-span-1 bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl h-fit space-y-5 text-white">
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-tertiary" />
            Deixe seu Recado
          </h3>
          <p className="text-white/70 text-xs leading-relaxed">
            Escreva uma mensagem especial de feliz aniversário ou parabéns de 18 anos para a Evilyn Albuquerque!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Seu Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-3.5 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:border-brand-tertiary focus:ring-1 focus:ring-brand-tertiary focus:outline-none transition-all text-sm text-white placeholder-white/40"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1">
              <MessageSquareCode className="w-3.5 h-3.5" /> Mensagem
            </label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva seus votos de felicidade..."
              className="w-full px-3.5 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:border-brand-tertiary focus:ring-1 focus:ring-brand-tertiary focus:outline-none transition-all text-sm text-white placeholder-white/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !text.trim()}
            className="w-full py-3 bg-brand-tertiary hover:bg-brand-tertiary/90 text-brand-primary rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed border border-brand-tertiary/20"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Publicar Recado
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-[11px] flex items-center gap-2 font-medium"
            >
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Seu recado foi publicado no mural! ✨</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Stream Card List */}
      <div className="lg:col-span-2 flex flex-col h-[400px] lg:h-[480px]">
        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-1.5 drop-shadow-md">
            <Sparkles className="w-4.5 h-4.5 text-brand-tertiary" />
            Mural de Parabéns
          </h3>
          <span className="bg-brand-primary/80 text-brand-tertiary text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-tertiary/20 shadow-sm backdrop-blur-sm">
            {messages.length} {messages.length === 1 ? "recado" : "recados"}
          </span>
        </div>

        {/* Scroll Box */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/50 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40 text-white" />
              <p className="text-xs">O mural está silencioso. Escreva o primeiro carinho!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    layout
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(index * 0.05, 0.6) }}
                    className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between h-full hover:border-brand-tertiary/40 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Quote Mark Accent */}
                      <span className="font-serif text-3xl text-brand-tertiary/50 block h-4 select-none leading-none">
                        “
                      </span>
                      <p className="text-white/90 text-xs leading-relaxed italic break-words">
                        {msg.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-brand-tertiary truncate max-w-[120px]">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-white/50">
                        {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
