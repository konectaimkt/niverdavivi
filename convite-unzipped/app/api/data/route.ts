import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

const FILE_PATH = "/tmp/evilyn_birthday_data.json";

// Default gifts list
const DEFAULT_GIFTS: Gift[] = [
  { id: "gift-1", name: "Kit Skincare Facial de Luxo", category: "Beleza & Cuidado", isReserved: false },
  { id: "gift-2", name: "Bolsa de Ombro/Crossbody Elegante", category: "Acessórios", isReserved: true, reservedBy: "Juliana Santos" },
  { id: "gift-3", name: "Paleta de Sombras Importada", category: "Maquiagem", isReserved: false },
  { id: "gift-4", name: "Difusor de Aromas Elétrico Ultrassônico", category: "Casa", isReserved: false },
  { id: "gift-5", name: "Perfume Floratta O Boticário", category: "Beleza & Cuidado", isReserved: false },
  { id: "gift-6", name: "Colar Delicado Ponto de Luz (Prata 925)", category: "Acessórios", isReserved: true, reservedBy: "Tia Cláudia" },
  { id: "gift-7", name: "Óculos de Sol Estilo Gatinho Moderno", category: "Acessórios", isReserved: false },
  { id: "gift-8", name: "Organizador de Maquiagem em Acrílico", category: "Organização", isReserved: false },
  { id: "gift-9", name: "Ring Light de Mesa com Tripé", category: "Tecnologia", isReserved: false },
  { id: "gift-10", name: "Livro 'Mulheres que Correm com os Lobos'", category: "Livros", isReserved: false },
  { id: "gift-11", name: "Fone de Ouvido Bluetooth Sem Fio Branco", category: "Tecnologia", isReserved: false },
  { id: "gift-12", name: "Kit de Pincéis de Maquiagem Profissionais", category: "Maquiagem", isReserved: false },
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    name: "Mãe (Valquíria)",
    text: "Minha princesa, ver você completar 18 anos enche meu coração de orgulho e gratidão. Que sua nova jornada seja brilhante, cheia de sabedoria, luz e conquistas. Te amo infinitamente! Feliz aniversário!",
    createdAt: "2026-08-10T14:30:00.000Z"
  },
  {
    id: "msg-2",
    name: "Juliana Santos (BFF)",
    text: "Evi!! Finalmente 18!! Mal posso esperar para celebrar com você na chácara! Já reservei seu presente e preparei meu estômago pro churrasco haha. Que você seja sempre essa garota incrível e cheia de luz. Te amo!",
    createdAt: "2026-08-10T15:15:00.000Z"
  },
  {
    id: "msg-3",
    name: "Tio Carlos",
    text: "Parabéns, Evilyn! Que Deus abençoe ricamente sua vida nessa nova fase adulta. Continue sempre essa sobrinha estudiosa, alegre e focada. Nos vemos no dia 22!",
    createdAt: "2026-08-10T16:00:00.000Z"
  }
];

const DEFAULT_RSVPS: RSVP[] = [
  {
    id: "rsvp-1",
    name: "Juliana Santos",
    phone: "11988887777",
    companionsCount: 0,
    confirmed: true,
    message: "Tô ansiosa demais pro dia 22!",
    createdAt: "2026-08-10T15:15:00.000Z"
  },
  {
    id: "rsvp-2",
    name: "Tio Carlos & Família",
    phone: "11977776666",
    companionsCount: 3,
    confirmed: true,
    message: "Confirmadíssimo, iremos em 4 pessoas.",
    createdAt: "2026-08-10T16:00:00.000Z"
  }
];

const INITIAL_STATE: AppState = {
  rsvps: DEFAULT_RSVPS,
  messages: DEFAULT_MESSAGES,
  gifts: DEFAULT_GIFTS
};

// In-memory cache as double fallback in case of transient container disk lockups
let memoryCache: AppState | null = null;

function loadState(): AppState {
  if (memoryCache) {
    return memoryCache;
  }
  
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      // Validate structure matches
      if (parsed.rsvps && parsed.messages && parsed.gifts) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading data file, using defaults:", error);
  }

  // Fallback and initialize
  saveState(INITIAL_STATE);
  return INITIAL_STATE;
}

function saveState(state: AppState) {
  memoryCache = state;
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing data file:", error);
  }
}

export async function GET() {
  const state = loadState();
  return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();
    const state = loadState();

    switch (action) {
      case "rsvp": {
        // Add new RSVP
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

        // If the RSVP is confirmed, and they left a message, optionally auto-add it to the guestbook!
        if (newRsvp.confirmed && newRsvp.message) {
          const newMessage: Message = {
            id: `msg-${Date.now()}-auto`,
            name: newRsvp.name,
            text: newRsvp.message,
            createdAt: new Date().toISOString()
          };
          // Check if message from this person is already there, if not add
          if (!state.messages.some(m => m.name === newMessage.name && m.text === newMessage.text)) {
            state.messages = [newMessage, ...state.messages];
          }
        }
        break;
      }

      case "message": {
        // Add manual message to the Guestbook
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
        // Reserve a gift
        const { giftId, name } = payload;
        state.gifts = state.gifts.map(g => {
          if (g.id === giftId) {
            return {
              ...g,
              isReserved: true,
              reservedBy: name.trim(),
              reservedAt: new Date().toISOString()
            };
          }
          return g;
        });
        break;
      }

      case "cancel-gift": {
        // Cancel a gift reservation (e.g. if someone made a mistake)
        const { giftId } = payload;
        state.gifts = state.gifts.map(g => {
          if (g.id === giftId) {
            return {
              ...g,
              isReserved: false,
              reservedBy: undefined,
              reservedAt: undefined
            };
          }
          return g;
        });
        break;
      }

      case "admin-delete-rsvp": {
        // Admin deletes an RSVP
        const { rsvpId } = payload;
        state.rsvps = state.rsvps.filter(r => r.id !== rsvpId);
        break;
      }

      case "admin-delete-message": {
        // Admin deletes a message
        const { messageId } = payload;
        state.messages = state.messages.filter(m => m.id !== messageId);
        break;
      }

      case "admin-reset": {
        // Reset to initial state
        saveState(INITIAL_STATE);
        return NextResponse.json(INITIAL_STATE);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    saveState(state);
    return NextResponse.json(state);
  } catch (error) {
    console.error("Error in POST API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
