import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AssignFlow | Modern Assignment Management for College Students',
  description: 'Organize coursework, track deadlines, monitor completion progress, and excel academically.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

