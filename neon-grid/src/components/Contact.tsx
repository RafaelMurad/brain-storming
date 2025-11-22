import { Component, createSignal, For } from 'solid-js';
import Section from './Section';
import Button from './Button';

const Contact: Component = () => {
  const [status, setStatus] = createSignal<'idle' | 'sending' | 'sent'>('idle');

  const channels = [
    { icon: '@', label: 'EMAIL', value: 'hello@neongrid.dev' },
    { icon: '⎔', label: 'GITHUB', value: 'github.com/neongrid' },
    { icon: '◉', label: 'LINKEDIN', value: 'linkedin.com/in/neongrid' },
  ];

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 2000);
    }, 1500);
  };

  return (
    <Section id="contact" tag="<TRANSMIT>" title="INIT_CONTACT">
      <div class="grid lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h3 class="font-display text-2xl text-white mb-4">ESTABLISH CONNECTION</h3>
          <p class="text-gray-400 mb-8">
            Ready to collaborate on your next project? Send a transmission and let's build something extraordinary.
          </p>

          <div class="space-y-4">
            <For each={channels}>
              {(channel) => (
                <a href="#" class="flex items-center gap-4 p-4 bg-cyber-card border border-white/10 hover:border-neon-cyan transition-colors">
                  <span class="w-10 h-10 flex items-center justify-center bg-neon-cyan/10 text-neon-cyan text-xl">
                    {channel.icon}
                  </span>
                  <div>
                    <span class="block text-xs text-gray-500">{channel.label}</span>
                    <span class="text-white">{channel.value}</span>
                  </div>
                </a>
              )}
            </For>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} class="space-y-6">
          <div>
            <label class="block text-xs text-neon-cyan mb-2 font-mono">IDENTIFIER</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              class="w-full px-4 py-4 bg-cyber-card border border-white/10 text-white placeholder-gray-500
                     focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs text-neon-cyan mb-2 font-mono">TRANSMISSION_FREQ</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-4 bg-cyber-card border border-white/10 text-white placeholder-gray-500
                     focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs text-neon-cyan mb-2 font-mono">MESSAGE_DATA</label>
            <textarea
              required
              rows={4}
              placeholder="Your message..."
              class="w-full px-4 py-4 bg-cyber-card border border-white/10 text-white placeholder-gray-500
                     focus:outline-none focus:border-neon-cyan transition-colors resize-none"
            />
          </div>

          <Button type="submit" variant="primary" class="w-full">
            {status() === 'sending' ? 'TRANSMITTING...' : status() === 'sent' ? 'TRANSMISSION COMPLETE ✓' : 'TRANSMIT MESSAGE →'}
          </Button>
        </form>
      </div>
    </Section>
  );
};

export default Contact;
