import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Hawkins Lab-style terminal window container
 * Used for About, Contact, and other terminal-themed sections
 */
export const TerminalWindow = ({ 
  title = 'HAWKINS_LAB_TERMINAL_v1.983',
  children,
  className = ''
}: TerminalWindowProps) => {
  return (
    <div className={`border-2 border-st-red shadow-neon-red-lg bg-st-deep-black/80 backdrop-blur-md ${className}`}>
      {/* Terminal header with traffic lights */}
      <div className="border-b-2 border-st-red px-8 py-4 bg-st-red/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-3" aria-hidden="true">
            <div className="w-4 h-4 rounded-full bg-st-red shadow-neon-red animate-pulse-slow" />
            <div className="w-4 h-4 rounded-full bg-st-neon-cyan shadow-neon-cyan" />
            <div className="w-4 h-4 rounded-full bg-st-neon-pink shadow-neon-pink" />
          </div>
          <span className="text-st-gray-light font-mono text-sm tracking-wider">
            {title}
          </span>
        </div>
      </div>

      {/* Terminal content - generous padding for readability */}
      <div className="p-8 md:p-12 font-mono">
        {children}
      </div>
    </div>
  );
};
