import { Component, createSignal, For } from 'solid-js';
import Section from './Section';
import Button from './Button';

const Contact: Component = () => {
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    guests: '1',
    date: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSubmitted, setIsSubmitted] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        guests: '1',
        date: '',
        message: '',
      });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: '\uD83D\uDCE7',
      label: 'Email',
      value: 'chef@galacticgourmet.dev',
      href: 'mailto:chef@galacticgourmet.dev',
    },
    {
      icon: '\uD83D\uDCCD',
      label: 'Location',
      value: 'Milky Way Galaxy, Earth Sector',
      href: '#',
    },
    {
      icon: '\uD83D\uDD52',
      label: 'Hours',
      value: 'Mon-Fri: 9AM - 6PM (UTC)',
      href: '#',
    },
  ];

  const socialLinks = [
    { icon: '\uD83D\uDC19', label: 'GitHub', href: '#' },
    { icon: '\uD83D\uDCBC', label: 'LinkedIn', href: '#' },
    { icon: '\uD83D\uDC26', label: 'Twitter', href: '#' },
    { icon: '\uD83C\uDFA8', label: 'Dribbble', href: '#' },
  ];

  return (
    <Section
      id="contact"
      title="Make a Reservation"
      subtitle="Ready to cook up something amazing together? Let's discuss your next stellar project"
      dividerIcon="\uD83D\uDCDE"
    >
      <div class="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Contact Info */}
        <div class="space-y-8">
          {/* Intro Text */}
          <div class="glass-card p-6">
            <h3 class="font-serif text-xl text-gold mb-4">
              \uD83C\uDF7D\uFE0F Book Your Table
            </h3>
            <p class="text-cream/70 leading-relaxed">
              Whether you're looking for a quick appetizer (consultation) or a full-course meal
              (complete project), I'm here to create something delicious for your digital palate.
            </p>
          </div>

          {/* Contact Methods */}
          <div class="space-y-4">
            <For each={contactMethods}>
              {(method) => (
                <a
                  href={method.href}
                  class="glass-card p-4 flex items-center gap-4 group hover:border-gold/40 transition-all duration-300"
                >
                  <span class="text-3xl group-hover:scale-110 transition-transform">
                    {method.icon}
                  </span>
                  <div>
                    <p class="text-gold text-sm uppercase tracking-wider">{method.label}</p>
                    <p class="text-cream/80">{method.value}</p>
                  </div>
                </a>
              )}
            </For>
          </div>

          {/* Social Links */}
          <div>
            <h4 class="font-serif text-lg text-gold mb-4">\u2B50 Follow the Chef</h4>
            <div class="flex gap-4">
              <For each={socialLinks}>
                {(social) => (
                  <a
                    href={social.href}
                    class="w-12 h-12 glass-card flex items-center justify-center text-xl hover:bg-gold/10 hover:border-gold/40 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <span class="group-hover:scale-110 transition-transform">{social.icon}</span>
                  </a>
                )}
              </For>
            </div>
          </div>

          {/* Decorative Quote */}
          <div class="text-center lg:text-left pt-4">
            <p class="font-serif italic text-cream/50 text-sm">
              "Good food is the foundation of genuine happiness"
            </p>
            <p class="text-cream/30 text-xs mt-1">- Auguste Escoffier</p>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div class="menu-card">
          <div class="text-center mb-6 pb-4 border-b border-gold/30">
            <h3 class="font-serif text-2xl text-gold">Reservation Form</h3>
            <p class="text-cream/50 text-sm">* Required fields</p>
          </div>

          {isSubmitted() ? (
            <div class="text-center py-12">
              <span class="text-6xl block mb-4">\uD83C\uDF89</span>
              <h4 class="font-serif text-2xl text-gold mb-2">Reservation Confirmed!</h4>
              <p class="text-cream/70">
                Thank you for your interest! I'll be in touch within 24 hours
                to discuss your project.
              </p>
              <Button
                variant="outline"
                class="mt-6"
                onClick={() => setIsSubmitted(false)}
              >
                Make Another Reservation
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Name Field */}
              <div>
                <label class="block text-gold text-sm mb-2" for="name">
                  \uD83D\uDC64 Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData().name}
                  onInput={(e) => setFormData({ ...formData(), name: e.target.value })}
                  class="w-full bg-space border border-gold/30 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                  placeholder="Your name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label class="block text-gold text-sm mb-2" for="email">
                  \uD83D\uDCE7 Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData().email}
                  onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
                  class="w-full bg-space border border-gold/30 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Project Type & Timeline */}
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gold text-sm mb-2" for="guests">
                    \uD83C\uDF7D\uFE0F Project Size
                  </label>
                  <select
                    id="guests"
                    value={formData().guests}
                    onChange={(e) => setFormData({ ...formData(), guests: e.target.value })}
                    class="w-full bg-space border border-gold/30 rounded-md px-4 py-3 text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                  >
                    <option value="1">Appetizer (Small)</option>
                    <option value="2">Main Course (Medium)</option>
                    <option value="3">Full Menu (Large)</option>
                    <option value="4">Banquet (Enterprise)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gold text-sm mb-2" for="date">
                    \uD83D\uDCC5 Start Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData().date}
                    onInput={(e) => setFormData({ ...formData(), date: e.target.value })}
                    class="w-full bg-space border border-gold/30 rounded-md px-4 py-3 text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label class="block text-gold text-sm mb-2" for="message">
                  \uD83D\uDCDD Special Requests *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData().message}
                  onInput={(e) => setFormData({ ...formData(), message: e.target.value })}
                  class="w-full bg-space border border-gold/30 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all resize-none"
                  placeholder="Tell me about your project, dietary requirements, and any allergies to certain technologies..."
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                class="w-full"
                disabled={isSubmitting()}
              >
                {isSubmitting() ? (
                  <>
                    <span class="animate-spin">\u23F3</span>
                    <span>Preparing Your Table...</span>
                  </>
                ) : (
                  <>
                    <span>\uD83D\uDE80</span>
                    <span>Submit Reservation</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Contact;
