"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Key, X, Trash2, Users, MessageSquare, Settings, Music, RefreshCw, AlertCircle } from "lucide-react";
import { RSVP, Message, Gift } from "../app/api/data/route";
import { TRACK_OPTIONS } from "./MusicPlayer";

interface AdminPanelProps {
  rsvps: RSVP[];
  messages: Message[];
  gifts: Gift[];
  currentTrackUrl: string;
  onTrackUrlChange: (url: string) => void;
  onRsvpUpdate: (updatedRsvps: RSVP[]) => void;
  onMessageUpdate: (updatedMessages: Message[]) => void;
  onGiftUpdate: (updatedGifts: Gift[]) => void;
}

export default function AdminPanel({
  rsvps,
  messages,
  gifts,
  currentTrackUrl,
  onTrackUrlChange,
  onRsvpUpdate,
  onMessageUpdate,
  onGiftUpdate,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"rsvps" | "messages" | "settings">("rsvps");
  const [customTrackUrl, setCustomTrackUrl] = useState(currentTrackUrl);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "evilyn18") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta. Dica: evilyn18");
    }
  };

  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm("Deseja realmente excluir esta confirmação de presença?")) return;
    try {
      const response = await fetch("/app/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin-delete-rsvp",
          payload: { rsvpId },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        onRsvpUpdate(data.rsvps);
      }
    } catch (err) {
      console.error("Failed to delete RSVP:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Deseja realmente excluir esta mensagem do mural?")) return;
    try {
      const response = await fetch("/app/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin-delete-message",
          payload: { messageId },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        onMessageUpdate(data.messages);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleResetData = async () => {
    if (!confirm("ATENÇÃO: Isso irá resetar todos os recados, RSVPs e limpar reservas de presentes para o estado padrão! Continuar?")) return;
    try {
      const response = await fetch("/app/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin-reset",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        onRsvpUpdate(data.rsvps);
        onMessageUpdate(data.messages);
        onGiftUpdate(data.gifts);
        alert("Todos os dados foram resetados!");
      }
    } catch (err) {
      console.error("Failed to reset database:", err);
    }
  };

  const handleSaveSettings = () => {
    onTrackUrlChange(customTrackUrl);
    alert("Configuração de música atualizada!");
  };

  return (
    <>
      {/* Small floating lock icon in bottom left footer */}
      <button
        id="btn-admin-panel"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm border border-neutral-200 text-neutral-500 hover:text-burgundy-800 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
        title="Painel Administrativo"
      >
        <Shield className="w-4 h-4" />
      </button>

      {/* Modal dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              id="admin-card"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-2xl w-full bg-[#EDEDE8] border border-burgundy-800/10 p-6 sm:p-8 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAuthenticated(false);
                  setPassword("");
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
              >
                <X className="w-6 h-6" />
              </button>

              {!isAuthenticated ? (
                /* Login Screen */
                <form onSubmit={handleLogin} className="space-y-6 py-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-burgundy-50 rounded-full flex items-center justify-center text-burgundy-800">
                    <Key className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-neutral-900">
                      Acesso Administrativo
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Senha padrão do convite: <code className="bg-neutral-100 px-1 py-0.5 rounded font-bold">evilyn18</code>
                    </p>
                  </div>

                  <div className="space-y-3 max-w-xs mx-auto">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha do painel"
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:border-burgundy-800 focus:outline-none text-center text-sm text-neutral-900 font-bold tracking-wider"
                    />
                    
                    {error && (
                      <p className="text-[10px] text-red-600 font-semibold flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Acessar Painel
                    </button>
                  </div>
                </form>
              ) : (
                /* Admin Dashboard */
                <div className="flex flex-col h-full overflow-hidden space-y-4">
                  <div className="border-b border-neutral-200 pb-3">
                    <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-burgundy-800" />
                      Painel do Anfitrião (Evilyn)
                    </h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-neutral-200 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab("rsvps")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeTab === "rsvps" ? "bg-burgundy-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Presenças ({rsvps.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeTab === "messages" ? "bg-burgundy-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Recados ({messages.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeTab === "settings" ? "bg-burgundy-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      Ajustes
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1 min-h-[250px] max-h-[450px]">
                    {activeTab === "rsvps" && (
                      <div className="space-y-2">
                        {rsvps.length === 0 ? (
                          <p className="text-center text-neutral-400 text-xs py-8">Nenhum RSVP registrado.</p>
                        ) : (
                          rsvps.map((rsvp) => (
                            <div key={rsvp.id} className="bg-white p-3.5 border border-neutral-100 rounded-xl flex items-center justify-between text-xs gap-4">
                              <div className="space-y-1">
                                <p className="font-bold text-neutral-900 text-sm">{rsvp.name}</p>
                                <p className="text-neutral-500">
                                  WhatsApp: <span className="font-semibold text-neutral-800">{rsvp.phone || "Não informado"}</span>
                                </p>
                                <p className="text-neutral-500">
                                  Confirmou:{" "}
                                  <span className={`font-semibold ${rsvp.confirmed ? "text-emerald-600" : "text-red-500"}`}>
                                    {rsvp.confirmed ? `Sim (+${rsvp.companionsCount} acompanhantes)` : "Não"}
                                  </span>
                                </p>
                                {rsvp.message && (
                                  <p className="text-neutral-600 italic bg-neutral-50 p-2 rounded border border-neutral-100 mt-1">
                                    &ldquo;{rsvp.message}&rdquo;
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteRsvp(rsvp.id)}
                                className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-all shrink-0 cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === "messages" && (
                      <div className="space-y-2">
                        {messages.length === 0 ? (
                          <p className="text-center text-neutral-400 text-xs py-8">Nenhum recado registrado.</p>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className="bg-white p-3 border border-neutral-100 rounded-xl flex items-center justify-between text-xs gap-4">
                              <div className="space-y-1 flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="font-bold text-neutral-950">{msg.name}</p>
                                  <span className="text-[10px] text-neutral-400">
                                    {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                                  </span>
                                </div>
                                <p className="text-neutral-600 italic">&ldquo;{msg.text}&rdquo;</p>
                              </div>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-all shrink-0 cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
                          <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                            <Music className="w-4 h-4 text-burgundy-800" />
                            Música de Fundo do Site
                          </h4>
                          
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">
                              Escolher melodia pré-definida:
                            </label>
                            <div className="flex flex-col gap-1.5">
                              {TRACK_OPTIONS.map((track) => (
                                <button
                                  key={track.url}
                                  type="button"
                                  onClick={() => setCustomTrackUrl(track.url)}
                                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                                    customTrackUrl === track.url
                                      ? "bg-burgundy-50 text-burgundy-900 border-burgundy-300"
                                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200"
                                  }`}
                                >
                                  {track.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">
                              Ou cole o link direto de qualquer arquivo de áudio (.mp3):
                            </label>
                            <input
                              type="text"
                              value={customTrackUrl}
                              onChange={(e) => setCustomTrackUrl(e.target.value)}
                              placeholder="https://exemplo.com/musica.mp3"
                              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:border-burgundy-800 text-neutral-800 focus:outline-none font-medium"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleSaveSettings}
                            className="w-full py-2 bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            Salvar Ajuste de Música
                          </button>
                        </div>

                        {/* Reset Data Tool */}
                        <div className="p-4 bg-red-50 border border-red-150 rounded-xl space-y-2">
                          <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                            <RefreshCw className="w-4 h-4 text-red-700" />
                            Zona de Perigo
                          </h4>
                          <p className="text-[10px] text-red-800 leading-normal">
                            Deseja limpar todos os recados e respostas e redefinir o convite para o estado inicial? Essa ação é irreversível.
                          </p>
                          <button
                            type="button"
                            onClick={handleResetData}
                            className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold transition-all"
                          >
                            Resetar Todos os Dados do Site
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
