'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ProcessStep } from '@/data/portfolio';

interface ProcessTimelineProps {
  steps: ProcessStep[];
  color: string;
}

export default function ProcessTimeline({ steps, color }: ProcessTimelineProps) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="label mb-4 block" style={{ color }}>
            Design Process
          </span>
          <h2 className="heading-lg">How We Got There</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ux-border to-transparent" />

          {steps.map((step, index) => (
            <ProcessStepCard
              key={step.phase}
              step={step}
              index={index}
              color={color}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStepCard({
  step,
  index,
  color,
  isEven,
}: {
  step: ProcessStep;
  index: number;
  color: string;
  isEven: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, scale }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 mb-24 last:mb-0 ${
        isEven ? '' : 'md:grid-flow-dense'
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold"
            style={{ backgroundColor: color }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className={`pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:col-start-2 md:pl-16'}`}
      >
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {step.phase}
        </span>
        <h3 className="heading-md mb-4">{step.title}</h3>
        <p className="body-lg mb-6">{step.description}</p>

        <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
          {step.deliverables.map((deliverable) => (
            <span
              key={deliverable}
              className="px-3 py-1 text-sm bg-ux-card border border-ux-border rounded-full text-ux-muted"
            >
              {deliverable}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Image */}
      {step.image && (
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className={`pl-24 md:pl-0 ${isEven ? 'md:col-start-2 md:pl-16' : 'md:pr-16'}`}
        >
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={step.image}
              alt={step.title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
