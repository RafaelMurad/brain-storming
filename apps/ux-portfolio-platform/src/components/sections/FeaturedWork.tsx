'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/data/portfolio';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function FeaturedWork() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="section-padding bg-ux-card/30">
      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
        >
          <div>
            <span className="label text-ux-primary mb-4 block">Selected Projects</span>
            <h2 className="heading-lg">Featured Work</h2>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-2 text-ux-muted hover:text-ux-text transition-colors"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Projects grid */}
        <div className="space-y-32">
          {caseStudies.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: typeof caseStudies[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        <div
          className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
            isEven ? '' : 'md:grid-flow-dense'
          }`}
        >
          {/* Image */}
          <div className={`relative overflow-hidden rounded-2xl ${isEven ? '' : 'md:col-start-2'}`}>
            <motion.div style={{ scale: imageScale }} className="relative aspect-[4/3]">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: `${project.color}20` }}
              />
            </motion.div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ux-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* View project button */}
            <motion.div
              className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
            >
              <span className="text-sm font-medium">View Case Study</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: project.color }}
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div style={{ y }} className={isEven ? '' : 'md:col-start-1 md:row-start-1'}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="label">{project.category}</span>
              </div>

              <h3 className="heading-md group-hover:text-gradient transition-all duration-300">
                {project.title}
              </h3>

              <p className="body-lg">{project.subtitle}</p>

              <div className="flex flex-wrap gap-2">
                {project.tools.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-sm bg-ux-border/30 rounded-full text-ux-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* Metrics preview */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ux-border/50">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <div
                      className="text-2xl font-display font-bold"
                      style={{ color: project.color }}
                    >
                      {metric.value}
                    </div>
                    <div className="text-sm text-ux-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
