'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ux-primary/5 to-transparent" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-ux-primary to-ux-secondary flex items-center justify-center mx-auto mb-8"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="heading-lg mb-6">
            Have a project in mind?
            <span className="block text-gradient">Let&apos;s create something great.</span>
          </h2>

          <p className="body-lg mb-10 max-w-2xl mx-auto">
            I&apos;m always excited to work on new challenges. Whether you need a complete
            redesign or help with UX research, I&apos;d love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:hello@alexmorgan.design"
              className="btn-outline inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>hello@alexmorgan.design</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
