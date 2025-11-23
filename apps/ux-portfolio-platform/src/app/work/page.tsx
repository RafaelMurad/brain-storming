'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/data/portfolio';

const categories = ['All', 'Mobile App Design', 'Web App Design', 'SaaS Product Design'];

export default function WorkPage() {
  const [filter, setFilter] = useState('All');

  const filteredProjects =
    filter === 'All'
      ? caseStudies
      : caseStudies.filter((p) => p.category === filter);

  return (
    <div className="pt-32">
      {/* Header */}
      <section className="container-custom mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="label text-ux-primary mb-4 block">Portfolio</span>
          <h1 className="heading-xl mb-6">Selected Work</h1>
          <p className="body-lg">
            A curated collection of projects where research-driven design meets
            measurable impact. Each case study tells a story of problem-solving
            and collaboration.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="container-custom mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-ux-primary text-white'
                  : 'bg-ux-card border border-ux-border text-ux-muted hover:text-ux-text hover:border-ux-primary/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="container-custom pb-32">
        <motion.div layout className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/work/${project.slug}`} className="group block">
                  <div className="card-hover overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
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

                      {/* Hover button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300"
                          style={{ backgroundColor: project.color }}
                        >
                          <ArrowUpRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-sm text-ux-muted">{project.category}</span>
                        <span className="text-sm text-ux-muted">•</span>
                        <span className="text-sm text-ux-muted">{project.year}</span>
                      </div>

                      <h2 className="text-2xl font-semibold mb-2 group-hover:text-gradient transition-all duration-300">
                        {project.title}
                      </h2>
                      <p className="text-ux-muted">{project.subtitle}</p>

                      {/* Quick metrics */}
                      <div className="flex gap-6 mt-4 pt-4 border-t border-ux-border/50">
                        {project.metrics.slice(0, 2).map((metric) => (
                          <div key={metric.label}>
                            <div
                              className="text-lg font-bold"
                              style={{ color: project.color }}
                            >
                              {metric.value}
                            </div>
                            <div className="text-xs text-ux-muted">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
