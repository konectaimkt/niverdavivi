import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

// Initialize Redis using Upstash's auto-detection (reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
}

// Unified state interfaces
export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  companionsCount: number;
  confirmed: boolean;
  message?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  category: string;
  reservedBy?: string;
  isReserved: boolean;
  reservedAt?: string;
}

interface AppState {
  rsvps: RSVP[];
  messages: Message[];
  gifts: Gift[];
}

// Default gifts list
const DEFAULT_GIFTS: Gift[] = [
  { id: "gift-1", name: "Kit Skincare Facial de Luxo", category: "Beleza & Cuidado", isReserved: false },
  { id: "gift-2", name: "Bolsa de Ombro/Crossbody Elegante", category: "Acessórios", isReserved: false },
  { id: "gift-3", name: "Paleta de Sombras Importada", category: "Maquiagem", isReserved: false },
  { id: "gift-4", name: "Difusor de Aromas Elétrico Ultrassônico", category: "Casa", isReserved: false },
  { id: "gift-5", name: "Perfume Floratta O Boticário", category: "Beleza & Cuidado", isReserved: false },
  { id: "gift-6", name: "Colar Delicado Ponto de Luz (Prata 925)", category: "Acessórios", isReserved: false },
  { id: "gift-7", name: "Óculos de Sol Estilo Gatinho Moderno", category: "Acessórios", isReserved: false },
  { id: "gift-8", name: "Organizador de Maquiagem em Acrílico", category: "Organização", isReserved: false },
  { id: "gift-9", name: "Ring Light de Mesa com Tripé", category: "Tecnologia", isReserved: false },
  { id: "gift-10", name: "Livro 'Mulheres que Correm com os Lobos'", category: "Livros", isReserved: false },
  { id: "gift-11", name: "Fone de Ouvido Bluetooth Sem Fio Branco", category: "Tecnologia", isReserved: false },
  { id: "gift-12", name: "Kit de Pincéis de Maquiagem Profissionais", category: "Maquiagem", isReserved: false },
];

const INITIAL_STATE: AppState = {
  rsvps: [],
  messages: [],
  gifts: DEFAULT_GIFTS
};

const KV_KEY = "evilyn_birthday_state_v2";

async function loadState(): Promise<AppState> {
  try {
    const r = getRedis();
    const data = await r.get<AppState>(KV_KEY);
    console.log("[DB] loadState result:", data ? "found" : "not found");
    if (data && Array.isArray(data.rsvps) && Array.isArray(data.messages) && Array.isArray(data.gifts)) {
      return data;
    }
  } catch (error) {
    console.error("[DB] Error reading from Redis:", error);
  }

  console.log("[DB] Using INITIAL_STATE");
  await saveState(INITIAL_STATE);
  return INITIAL_STATE;
}

async function saveState(state: AppState): Promise<void> {
  try {
    const r = getRedis();
    await r.set(KV_KEY, state);
    console.log("[DB] saveState OK, rsvps:", state.rsvps.length, "messages:", state.messages.length);
  } catch (error) {
    console.error("[DB] Error writing to Redis:", error);
    throw error;
  }
}

export async function GET() {
  const state = await loadState();
  return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();
    console.log("[API] POST action:", action);
    const state = await loadState();

    switch (action) {
      case "rsvp": {
        const newRsvp: RSVP = {
          id: `rsvp-${Date.now()}`,
          name: payload.name.trim(),
          phone: payload.phone?.trim() || "",
          companionsCount: Math.max(0, parseInt(payload.companionsCount) || 0),
          confirmed: payload.confirmed,
          message: payload.message?.trim() || "",
          createdAt: new Date().toISOString()
        };

        state.rsvps = [newRsvp, ...state.rsvps];

        // Auto-add to guestbook if confirmed with a message
        if (newRsvp.confirmed && newRsvp.message) {
          const newMessage: Message = {
            id: `msg-${Date.now()}-auto`,
            name: newRsvp.name,
            text: newRsvp.message,
            createdAt: new Date().toISOString()
          };
          if (!state.messages.some(m => m.name === newMessage.name && m.text === newMessage.text)) {
            state.messages = [newMessage, ...state.messages];
          }
        }
        break;
      }

      case "message": {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          name: payload.name.trim(),
          text: payload.text.trim(),
          createdAt: new Date().toISOString()
        };
        state.messages = [newMessage, ...state.messages];
        break;
      }

      case "reserve-gift": {
        const { giftId, name } = payload;
        state.gifts = state.gifts.map(g => {
          if (g.id === giftId) {
            return { ...g, isReserved: true, reservedBy: name.trim(), reservedAt: new Date().toISOString() };
          }
          return g;
        });
        break;
      }

      case "cancel-gift": {
        const { giftId } = payload;
        state.gifts = state.gifts.map(g => {
          if (g.id === giftId) {
            return { ...g, isReserved: false, reservedBy: undefined, reservedAt: undefined };
          }
          return g;
        });
        break;
      }

      case "admin-delete-rsvp": {
        const { rsvpId } = payload;
        state.rsvps = state.rsvps.filter(r => r.id !== rsvpId);
        break;
      }

      case "admin-delete-message": {
        const { messageId } = payload;
        state.messages = state.messages.filter(m => m.id !== messageId);
        break;
      }

      case "admin-reset": {
        await saveState(INITIAL_STATE);
        return NextResponse.json(INITIAL_STATE);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await saveState(state);
    return NextResponse.json(state);
  } catch (error) {
    console.error("[API] Error in POST:", error);
    return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
  }
}
