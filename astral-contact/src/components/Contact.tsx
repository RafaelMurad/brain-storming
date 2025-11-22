import { Component, createSignal, For } from 'solid-js';
import Section from './Section';
import Button from './Button';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: Component = () => {
  const [formData, setFormData] = createSignal<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [beaconPulse, setBeaconPulse] = createSignal(0);

  // Beacon animation
  setInterval(() => {
    setBeaconPulse((prev) => (prev + 1) % 100);
  }, 50);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const data = formData();

    if (!data.name.trim()) {
      newErrors.name = 'IDENTITY REQUIRED';
    }

    if (!data.email.trim()) {
      newErrors.email = 'TRANSMISSION ADDRESS REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'INVALID TRANSMISSION FORMAT';
    }

    if (!data.subject.trim()) {
      newErrors.subject = 'SIGNAL TYPE REQUIRED';
    }

    if (!data.message.trim()) {
      newErrors.message = 'MESSAGE CONTENT REQUIRED';
    } else if (data.message.length < 10) {
      newErrors.message = 'MESSAGE TOO SHORT FOR TRANSMISSION';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSuccess(false);
    }, 3000);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors()[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Section
      id="contact"
      title="BEACON TRANSMISSION"
      subtitle="// ESTABLISH CONTACT"
      cropCircles
      glowAccent="purple"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact form */}
        <div class="alien-card p-8">
          {/* Terminal header */}
          <div class="flex items-center gap-2 mb-6 pb-4 border-b border-alien-glow/20">
            <div class="w-3 h-3 rounded-full bg-red-500/70" />
            <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div class="w-3 h-3 rounded-full bg-alien-glow/70" />
            <span class="ml-2 font-mono text-xs text-gray-500">transmission_form.exe</span>
          </div>

          {isSuccess() ? (
            <div class="text-center py-12">
              <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-alien-glow/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-alien-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
              <h3 class="font-display text-2xl font-bold text-alien-glow alien-text-glow mb-2">
                TRANSMISSION SENT
              </h3>
              <p class="font-mono text-sm text-gray-400">
                Your message is traveling through the cosmos...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Name field */}
              <div>
                <label class="block font-mono text-sm text-alien-teal mb-2">
                  IDENTITY_DESIGNATION:
                </label>
                <input
                  type="text"
                  value={formData().name}
                  onInput={(e) => updateField('name', e.currentTarget.value)}
                  class={`input-alien w-full ${errors().name ? 'border-red-500' : ''}`}
                  placeholder="Enter your Earth name"
                />
                {errors().name && (
                  <p class="mt-1 font-mono text-xs text-red-400">[ERROR] {errors().name}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label class="block font-mono text-sm text-alien-teal mb-2">
                  TRANSMISSION_ADDRESS:
                </label>
                <input
                  type="email"
                  value={formData().email}
                  onInput={(e) => updateField('email', e.currentTarget.value)}
                  class={`input-alien w-full ${errors().email ? 'border-red-500' : ''}`}
                  placeholder="your@email.earth"
                />
                {errors().email && (
                  <p class="mt-1 font-mono text-xs text-red-400">[ERROR] {errors().email}</p>
                )}
              </div>

              {/* Subject field */}
              <div>
                <label class="block font-mono text-sm text-alien-teal mb-2">
                  SIGNAL_TYPE:
                </label>
                <select
                  value={formData().subject}
                  onChange={(e) => updateField('subject', e.currentTarget.value)}
                  class={`input-alien w-full ${errors().subject ? 'border-red-500' : ''}`}
                >
                  <option value="">Select transmission type</option>
                  <option value="collaboration">Collaboration Request</option>
                  <option value="project">Project Inquiry</option>
                  <option value="job">Employment Opportunity</option>
                  <option value="general">General Message</option>
                  <option value="classified">Classified Intel</option>
                </select>
                {errors().subject && (
                  <p class="mt-1 font-mono text-xs text-red-400">[ERROR] {errors().subject}</p>
                )}
              </div>

              {/* Message field */}
              <div>
                <label class="block font-mono text-sm text-alien-teal mb-2">
                  MESSAGE_CONTENT:
                </label>
                <textarea
                  value={formData().message}
                  onInput={(e) => updateField('message', e.currentTarget.value)}
                  rows={5}
                  class={`input-alien w-full resize-none ${errors().message ? 'border-red-500' : ''}`}
                  placeholder="Compose your interstellar message..."
                />
                {errors().message && (
                  <p class="mt-1 font-mono text-xs text-red-400">[ERROR] {errors().message}</p>
                )}
                <p class="mt-1 font-mono text-xs text-gray-500">
                  {formData().message.length} / 1000 characters
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting()}
                class="w-full"
                glowColor="green"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                <span>TRANSMIT MESSAGE</span>
              </Button>
            </form>
          )}
        </div>

        {/* Beacon visualization and info */}
        <div class="space-y-8">
          {/* Beacon animation */}
          <div class="relative aspect-square max-w-sm mx-auto">
            {/* Outer rings */}
            <For each={[1, 2, 3, 4, 5]}>
              {(i) => (
                <div
                  class="absolute rounded-full border border-alien-purple/20"
                  style={{
                    inset: `${i * 15}%`,
                    animation: `beacon ${2 + i * 0.5}s ease-out infinite`,
                    "animation-delay": `${i * 0.3}s`,
                  }}
                />
              )}
            </For>

            {/* Center beacon */}
            <div class="absolute inset-1/3 rounded-full bg-alien-purple/20 flex items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-alien-purple animate-pulse shadow-glow-purple flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M4.93 4.93l4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              </div>
            </div>

            {/* Signal waves */}
            <svg
              class="absolute inset-0 w-full h-full animate-rotate-slow"
              viewBox="0 0 100 100"
              style={{ "animation-duration": "30s" }}
            >
              <path
                d="M50 10 Q70 50, 50 90"
                stroke="rgba(157, 78, 221, 0.3)"
                fill="none"
                stroke-width="0.5"
              />
              <path
                d="M10 50 Q50 30, 90 50"
                stroke="rgba(46, 196, 182, 0.3)"
                fill="none"
                stroke-width="0.5"
              />
            </svg>
          </div>

          {/* Contact info cards */}
          <div class="space-y-4">
            <ContactInfoCard
              icon="location"
              label="BASE LOCATION"
              value="San Francisco, Earth"
              color="green"
            />
            <ContactInfoCard
              icon="email"
              label="TRANSMISSION CHANNEL"
              value="hello@astralcontact.dev"
              color="purple"
            />
            <ContactInfoCard
              icon="signal"
              label="SIGNAL FREQUENCY"
              value="Available for Projects"
              color="teal"
            />
          </div>

          {/* Social links */}
          <div class="alien-card p-6">
            <h4 class="font-mono text-sm text-gray-500 mb-4">ALTERNATIVE CHANNELS:</h4>
            <div class="flex gap-4">
              <SocialLink href="#" icon="github" label="GitHub" />
              <SocialLink href="#" icon="linkedin" label="LinkedIn" />
              <SocialLink href="#" icon="twitter" label="Twitter" />
              <SocialLink href="#" icon="discord" label="Discord" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;

// Contact Info Card Component
interface ContactInfoCardProps {
  icon: string;
  label: string;
  value: string;
  color: 'green' | 'purple' | 'teal';
}

const ContactInfoCard: Component<ContactInfoCardProps> = (props) => {
  const colorClasses = () => {
    switch (props.color) {
      case 'purple':
        return 'border-alien-purple/30 hover:border-alien-purple/50';
      case 'teal':
        return 'border-alien-teal/30 hover:border-alien-teal/50';
      default:
        return 'border-alien-glow/30 hover:border-alien-glow/50';
    }
  };

  const iconColor = () => {
    switch (props.color) {
      case 'purple':
        return 'text-alien-purple';
      case 'teal':
        return 'text-alien-teal';
      default:
        return 'text-alien-glow';
    }
  };

  return (
    <div class={`alien-card p-4 flex items-center gap-4 ${colorClasses()} transition-colors`}>
      <div class={`${iconColor()}`}>
        <ContactIcon type={props.icon} />
      </div>
      <div>
        <p class="font-mono text-xs text-gray-500">{props.label}</p>
        <p class="text-gray-200">{props.value}</p>
      </div>
    </div>
  );
};

// Contact Icon Component
const ContactIcon: Component<{ type: string }> = (props) => {
  switch (props.type) {
    case 'location':
      return (
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'email':
      return (
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      );
    case 'signal':
      return (
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
        </svg>
      );
    default:
      return null;
  }
};

// Social Link Component
interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
}

const SocialLink: Component<SocialLinkProps> = (props) => {
  return (
    <a
      href={props.href}
      class="w-10 h-10 rounded-lg bg-alien-void-lighter border border-alien-glow/20 flex items-center justify-center text-gray-400 hover:text-alien-glow hover:border-alien-glow/50 transition-all duration-300"
      title={props.label}
    >
      <SocialIcon type={props.icon} />
    </a>
  );
};

// Social Icon Component
const SocialIcon: Component<{ type: string }> = (props) => {
  switch (props.type) {
    case 'github':
      return (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'discord':
      return (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    default:
      return null;
  }
};
