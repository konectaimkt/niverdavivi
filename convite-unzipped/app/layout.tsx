import type {Metadata} from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Great_Vibes } from 'next/font/google';
import './globals.css'; // Global styles

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Convite de Aniversário - Evilyn Albuquerque 18 Anos',
  description: 'Você está convidado para celebrar os 18 anos da Evilyn Albuquerque no dia 22 de Agosto de 2026. Confirme sua presença!',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${jakarta.variable} ${greatVibes.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-neutral-900 bg-cream-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}

