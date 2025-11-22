'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Metric } from '@/data/portfolio';

interface MetricsGridProps {
  metrics: Metric[];
  color: string;
}

export default function MetricsGrid({ metrics, color }: MetricsGridProps) {
  return (
    <section className="section-padding bg-ux-card/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="label mb-4 block" style={{ color }}>
            Impact & Results
          </span>
          <h2 className="heading-lg">The Numbers Speak</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              color={color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  metric,
  index,
  color,
}: {
  metric: Metric;
  index: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value and suffix
    const numericMatch = metric.value.match(/^([+-]?)(\d+\.?\d*)/);
    if (!numericMatch) {
      setDisplayValue(metric.value);
      return;
    }

    const prefix = numericMatch[1];
    const targetNum = parseFloat(numericMatch[2]);
    const suffix = metric.value.replace(numericMatch[0], '');

    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetNum - start) * eased;

      // Format based on original value format
      if (metric.value.includes('.')) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.round(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, metric.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="metric-card group hover:-translate-y-2 transition-transform duration-300"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: `${color}20` }}
      />

      <div className="relative">
        <div className="metric-value mb-2" style={{ color }}>
          {displayValue}
        </div>
        <h3 className="text-xl font-semibold mb-2">{metric.label}</h3>
        <p className="text-sm text-ux-muted">{metric.description}</p>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
