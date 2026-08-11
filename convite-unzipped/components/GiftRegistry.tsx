"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Gift, Copy, Check, ExternalLink, Sparkles, Smartphone, Heart, ShoppingBag } from "lucide-react";
import { Gift as GiftType } from "../app/api/data/route";

interface GiftRegistryProps {
  gifts?: GiftType[];
  onGiftUpdate?: (updatedGifts: GiftType[]) => void;
}

export default function GiftRegistry({ gifts = [], onGiftUpdate }: GiftRegistryProps) {
  const [pixCopied, setPixCopied] = useState(false);

  // PIX Key - Using the provided contact number
  const pixKey = "15988295630"; // Celular

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const perfumeLinks = [
    {
      name: "Liz Desodorante Colônia (100 ml)",
      brand: "O Boticário",
      url: "https://www.boticario.com.br/liz-desodorante-colonia-100-ml-o-boticario/",
    },
    {
      name: "Egeo Choc Desodorante Colônia (90 ml)",
      brand: "O Boticário",
      url: "https://www.boticario.com.br/egeo-choc-desodorante-colonia-90ml-v2/",
    },
    {
      name: "Creme Acetinado Lily Gardênia (250g)",
      brand: "O Boticário",
      url: "https://www.boticario.com.br/creme-acetinado-hidratante-desodorante-corporal-lily-gardenia-250g/",
    },
    {
      name: "Sandália Crocs Crocband Clog (Quartz)",
      brand: "Crocs",
      url: "https://www.crocs.com.br/sandalia-crocs-crocband-clog-quartz-x11016_10067/p",
    },
  ];

  return (
    <div id="gift-registry-container" className="space-y-8 max-w-4xl mx-auto px-4 py-2">
      
      {/* Gift Guide (Dicas de Presente) Card */}
      <div className="bg-white/90 backdrop-blur-md border border-burgundy-800/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2 border-b border-neutral-100 pb-4">
          <span className="font-script text-burgundy-800 text-3xl">Sugestões</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Dicas de Presentes
          </h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Fiz esta listinha de preferências de vestuário e mimos para facilitar caso queira me presentear! ❤️
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          
          {/* Clothing & Sizes column */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-burgundy-900 flex items-center gap-2 pb-2 border-b border-burgundy-800/10">
              <Sparkles className="w-5 h-5 text-burgundy-800 shrink-0" />
              Tamanhos & Medidas
            </h4>

            <div className="space-y-4">
              {/* Look */}
              <div className="flex items-center justify-between p-4 bg-burgundy-50/50 border border-burgundy-100/50 rounded-xl">
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Roupas / Vestuário</span>
                  <span className="text-sm font-bold text-neutral-800">Look Preferido</span>
                </div>
                <span className="bg-burgundy-800 text-white font-serif font-black px-3 py-1 rounded-full text-sm">
                  P ou PP
                </span>
              </div>

              {/* Footwear */}
              <div className="flex items-center justify-between p-4 bg-burgundy-50/50 border border-burgundy-100/50 rounded-xl">
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Calçados</span>
                  <span className="text-sm font-bold text-neutral-800">Tamanho de Sapato</span>
                </div>
                <span className="bg-burgundy-800 text-white font-serif font-black px-3 py-1 rounded-full text-sm">
                  36/37
                </span>
              </div>

              {/* Measurements details card */}
              <div className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-xl space-y-3">
                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                  Minhas Medidas Corporais
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <span className="block text-[9px] text-neutral-400 font-bold uppercase">Busto</span>
                    <span className="text-sm font-serif font-bold text-burgundy-800">88 cm</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <span className="block text-[9px] text-neutral-400 font-bold uppercase">Cintura</span>
                    <span className="text-sm font-serif font-bold text-burgundy-800">74 cm</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <span className="block text-[9px] text-neutral-400 font-bold uppercase">Quadril</span>
                    <span className="text-sm font-serif font-bold text-burgundy-800">95 cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perfumes & Links column */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-burgundy-900 flex items-center gap-2 pb-2 border-b border-burgundy-800/10">
              <ShoppingBag className="w-5 h-5 text-burgundy-800 shrink-0" />
              Perfumes & Mimos Favoritos
            </h4>

            <div className="space-y-3">
              {perfumeLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-white border border-neutral-150 rounded-xl hover:border-burgundy-800/30 hover:bg-neutral-50/50 transition-all shadow-sm group cursor-pointer"
                >
                  <div className="space-y-0.5 text-left max-w-[80%]">
                    <span className="block text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                      {item.brand}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-burgundy-800 transition-colors truncate">
                      {item.name}
                    </p>
                  </div>
                  
                  <div className="p-1.5 rounded-full bg-burgundy-50 text-burgundy-800 group-hover:bg-burgundy-800 group-hover:text-white transition-all shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vale Presente Card (PIX / iPhone hint) */}
      <div className="bg-gradient-to-br from-burgundy-950 to-burgundy-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative background logo */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 select-none pointer-events-none">
          <Gift className="w-64 h-64" />
        </div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="space-y-2 text-left">
            <span className="bg-amber-400 text-burgundy-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Vale Presente
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Vale Presente
            </h3>
            <p className="text-burgundy-100 text-sm leading-relaxed max-w-xl">
              Se você prefere um presente prático, você pode enviar qualquer presente em valor via PIX!
            </p>
          </div>

          {/* iPhone Hint banner */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-xl max-w-xl">
            <Smartphone className="w-8 h-8 text-amber-300 shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-neutral-100 text-left">
              <span className="font-bold text-amber-300">IPHONE 16 Pro MAX</span> já me ajuda a gravar conteúdo com mais qualidade para vocês!
            </p>
          </div>

          {/* Copiar PIX section */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg">
            <div className="text-left w-full sm:w-auto">
              <span className="block text-[10px] text-burgundy-200 uppercase tracking-widest font-bold">
                Chave PIX (Celular)
              </span>
              <span className="block text-sm font-semibold truncate text-white">
                (15) 98829-5630
              </span>
            </div>

            <button
              id="btn-copy-gift-pix"
              onClick={handleCopyPix}
              className="w-full sm:w-auto py-2.5 px-5 bg-white text-burgundy-950 rounded-lg text-xs font-bold hover:bg-neutral-100 transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98 shrink-0 cursor-pointer"
            >
              {pixCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Chave PIX
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
