'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle, Linkedin, Twitter } from 'lucide-react';
import { profile } from '@/data/portfolio';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="label text-ux-primary mb-4 block">Get In Touch</span>
            <h1 className="heading-xl mb-6">
              Let&apos;s create
              <span className="block text-gradient">something amazing</span>
            </h1>
            <p className="body-lg mb-12">
              Have a project in mind? I&apos;d love to hear about it. Fill out the form
              or reach out directly, and I&apos;ll get back to you within 24 hours.
            </p>

            {/* Contact info */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ux-card border border-ux-border flex items-center justify-center">
                  <Mail className="w-5 h-5 text-ux-primary" />
                </div>
                <div>
                  <div className="text-sm text-ux-muted">Email</div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium hover:text-ux-primary transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ux-card border border-ux-border flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-ux-primary" />
                </div>
                <div>
                  <div className="text-sm text-ux-muted">Location</div>
                  <span className="font-medium">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <div className="text-sm text-ux-muted mb-4">Find me on</div>
              <div className="flex gap-4">
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-ux-card border border-ux-border flex items-center justify-center hover:border-ux-primary hover:text-ux-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={profile.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-ux-card border border-ux-border flex items-center justify-center hover:border-ux-primary hover:text-ux-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={profile.social.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-ux-card border border-ux-border flex items-center justify-center hover:border-ux-primary hover:text-ux-primary transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm7.938 5.563a10.187 10.187 0 012.062 6.187c-1.875-.375-3.75-.5-5.563-.375-.188-.5-.375-.938-.563-1.375 2.063-.875 3.375-1.938 4.063-2.438v-2zM12 2c2.625 0 5.063 1 6.875 2.688-.625.5-1.875 1.437-3.813 2.187-1.187-2.125-2.5-3.875-3.062-4.562.625-.188 1.313-.313 2-.313zM9.5 2.813c.563.625 1.875 2.375 3.063 4.437-2.875.75-6.063 1.125-7.938 1.188A10.165 10.165 0 019.5 2.813zM2 12v-.5c.25 0 5.75-.125 9.25-1.125.25.438.438.875.625 1.313-3.375.938-6.125 3.375-7.563 5.187A9.99 9.99 0 012 12zm3.625 6.75c1.188-1.625 3.625-3.875 6.5-4.75 1.125 2.938 1.563 5.375 1.688 6.125-4.563 1.875-6.813 0-8.188-1.375zm10.313 1.375c-.125-.563-.5-2.875-1.563-5.688 1.688-.25 3.438-.125 5.188.313-.438 2.5-1.813 4.625-3.625 5.375z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="card p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-ux-primary/20 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-ux-primary" />
                </motion.div>
                <h2 className="heading-md mb-4">Message Sent!</h2>
                <p className="text-ux-muted mb-8">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({
                      name: '',
                      email: '',
                      projectType: '',
                      budget: '',
                      message: '',
                    });
                  }}
                  className="btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ux-bg border border-ux-border focus:border-ux-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ux-bg border border-ux-border focus:border-ux-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formState.projectType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ux-bg border border-ux-border focus:border-ux-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select type</option>
                      <option value="ux-research">UX Research</option>
                      <option value="product-design">Product Design</option>
                      <option value="design-system">Design System</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formState.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-ux-bg border border-ux-border focus:border-ux-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select budget</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Tell me about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-ux-bg border border-ux-border focus:border-ux-primary focus:outline-none transition-colors resize-none"
                    placeholder="Describe your project, goals, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
