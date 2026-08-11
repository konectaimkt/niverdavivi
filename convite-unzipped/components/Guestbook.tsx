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
      const response = await fetch("/app/api/data", {
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
      <div className="lg:col-span-1 bg-white border border-burgundy-800/10 p-6 rounded-2xl shadow-md h-fit space-y-5">
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-burgundy-800" />
            Deixe seu Recado
          </h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Escreva uma mensagem especial de feliz aniversário ou parabéns de 18 anos para a Evilyn Albuquerque!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Seu Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 focus:outline-none transition-all text-sm text-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1">
              <MessageSquareCode className="w-3.5 h-3.5" /> Mensagem
            </label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva seus votos de felicidade..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 focus:outline-none transition-all text-sm text-neutral-900 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !text.trim()}
            className="w-full py-3 bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200 mb-4">
          <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-burgundy-800" />
            Mural de Parabéns
          </h3>
          <span className="bg-burgundy-50 text-burgundy-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-burgundy-100">
            {messages.length} {messages.length === 1 ? "recado" : "recados"}
          </span>
        </div>

        {/* Scroll Box */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40" />
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
                    className="p-5 rounded-2xl bg-white border border-burgundy-800/10 shadow-sm flex flex-col justify-between h-full hover:border-burgundy-800/20 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Quote Mark Accent */}
                      <span className="font-serif text-3xl text-burgundy-200 block h-4 select-none leading-none">
                        “
                      </span>
                      <p className="text-neutral-600 text-xs leading-relaxed italic break-words">
                        {msg.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-neutral-400">
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
