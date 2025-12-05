import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type LogVariant = 'system' | 'user' | 'alert';

type TerminalLine = {
  id: number;
  variant: LogVariant;
  message: string;
};

const baseLog: TerminalLine[] = [
  { id: 1, variant: 'system', message: '>> INITIALIZING SECURE CHANNEL...' },
  { id: 2, variant: 'system', message: '>> AUTH HANDSHAKE COMPLETE' },
  { id: 3, variant: 'system', message: '>> READY FOR COMMAND INPUT' },
];

const commandResponses: Record<string, string[]> = {
  help: [
    'Available commands:',
    'help · status · contact · projects · ping · clear',
  ],
  status: [
    'STATUS >> Availability: OPEN',
    'STATUS >> Preferred: Remote (UTC+0)',
    'STATUS >> Response time: under 24h',
  ],
  contact: [
    'CONTACT >> Primary channel: rafael.murad@example.com',
    'CONTACT >> Secondary: linkedin.com/in/rafaelmurad',
  ],
  projects: [
    'PROJECTS >> Evidence board available above, use Access File to inspect detailed dossiers.',
  ],
  ping: ['PONG // signal steady (42ms)'],
};

const contactChannels = [
  {
    label: 'Email',
    value: 'rafael.murad@example.com',
    href: 'mailto:rafael.murad@example.com',
    detail: 'Fastest response · <24h',
  },
  {
    label: 'LinkedIn',
    value: '/rafaelmurad',
    href: 'https://linkedin.com/in/rafaelmurad',
    detail: 'Professional updates + DMs',
  },
  {
    label: 'GitHub',
    value: 'github.com/rafaelmurad',
    href: 'https://github.com/rafaelmurad',
    detail: 'Open-source workbench',
  },
];

const quickStats = [
  { label: 'Response time', value: '< 24h' },
  { label: 'Timezone', value: 'UTC+0' },
  { label: 'Engagements', value: 'Remote · Contract · Full-time' },
];

export const Contact = () => {
  const [log, setLog] = useState(baseLog);
  const [inputValue, setInputValue] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextId = useRef(baseLog.length + 1);

  const commandList = useMemo(() => Object.keys(commandResponses).sort(), []);

  const playPing = useCallback(() => {
    if (!audioEnabled || typeof window === 'undefined') return;
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextCtor();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 460;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    oscillator.stop(ctx.currentTime + 0.25);
  }, [audioEnabled]);

  const appendLog = useCallback((entries: Omit<TerminalLine, 'id'>[]) => {
    setLog((current) => {
      const nextEntries = entries.map((entry) => ({
        id: nextId.current++,
        ...entry,
      }));
      return [...current, ...nextEntries].slice(-20);
    });
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [log]);

  const handleCommand = useCallback(
    (value: string) => {
      const sanitized = value.trim();
      if (!sanitized) return;

      appendLog([{ variant: 'user', message: `> ${sanitized}` }]);

      if (sanitized.toLowerCase() === 'clear') {
        setLog(baseLog);
        return;
      }

      const response = commandResponses[sanitized.toLowerCase()];
      if (response) {
        appendLog(response.map((message) => ({ variant: 'system', message }))); 
        playPing();
      } else {
        appendLog([
          {
            variant: 'alert',
            message: `Command "${sanitized}" not recognized. Type "help" to list options.`,
          },
        ]);
      }
    },
    [appendLog, playPing],
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCommand(inputValue);
    setInputValue('');
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-start gap-6">
          <div className="evidence-stamp" aria-hidden="true">
            <span>COM</span>
          </div>
          <div>
            <p className="text-xs font-mono text-text-tertiary tracking-[0.35em] uppercase mb-3">
              OPEN CHANNEL // SECURE TRANSMISSION
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-st-red-glow font-benguiat" style={{ textShadow: '0 0 30px rgba(230, 46, 46, 0.4)' }}>
              Transmission Deck
            </h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="terminal-card">
            <div className="terminal-card__header">
              <div className="terminal-lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <button
                type="button"
                className={`audio-toggle ${audioEnabled ? 'audio-toggle--on' : ''}`}
                onClick={() => setAudioEnabled((prev) => !prev)}
                aria-pressed={audioEnabled}
              >
                AUDIO {audioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="terminal-screen" role="log" aria-live="polite" ref={logRef}>
              {log.map((line) => (
                <p key={line.id} className={`terminal-line terminal-line--${line.variant}`}>
                  {line.message}
                </p>
              ))}
            </div>

            <form className="terminal-input" onSubmit={onSubmit}>
              <label htmlFor="command" className="sr-only">
                Terminal command input
              </label>
              <span aria-hidden="true">{'>'}</span>
              <input
                id="command"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Type 'help' for available commands"
                autoComplete="off"
              />
              <button type="submit">EXECUTE</button>
            </form>

            <div className="terminal-commands">
              <p>Available commands</p>
              <div>
                {commandList.map((command) => (
                  <button key={command} type="button" onClick={() => handleCommand(command)}>
                    {command}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-status">
              <div>
                <p className="contact-signal">
                  <span aria-hidden="true" />
                  CHANNEL STABLE
                </p>
                <h3>Available for mission-critical work</h3>
                <p>Open to remote contracts, advisory work, or full-time roles.</p>
              </div>
              <div className="contact-flair" aria-hidden="true">
                <span />
                <span />
              </div>
            </div>

            <div className="contact-channels">
              {contactChannels.map((channel) => (
                <a key={channel.label} href={channel.href} className="contact-channel" target={channel.href.startsWith('http') ? '_blank' : undefined} rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}>
                  <p>{channel.label}</p>
                  <h4>{channel.value}</h4>
                  <span>{channel.detail}</span>
                </a>
              ))}
            </div>

            <div className="contact-actions">
              <a href="mailto:rafael.murad@example.com" className="contact-actions__primary">
                <span>Send Transmission</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
                </svg>
              </a>
              <div className="contact-actions__secondary">
                <a href="https://linkedin.com/in/rafaelmurad" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/rafaelmurad" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            <div className="contact-stats">
              {quickStats.map((stat) => (
                <div key={stat.label}>
                  <p>{stat.value}</p>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="contact-footer">
          <p>
            <span>{'>'}</span>
            Built with React · TypeScript · Tailwind CSS
          </p>
          <p>
            <span>{'>'}</span>
            Powered by Hawkins Lab imagination + Upside Down aesthetics
          </p>
          <p>© {new Date().getFullYear()} RAFAEL MURAD · ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </section>
  );
};
