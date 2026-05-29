import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MemeGag - Where the Internet Laughs',
  description: 'A next-generation social entertainment platform for memes, humor, and culture.',
  openGraph: {
    title: 'MemeGag - Where the Internet Laughs',
    description: 'A next-generation social entertainment platform for memes, humor, and culture.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
