'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Download, ExternalLink } from 'lucide-react';
import { profile, services } from '@/data/portfolio';

const experiences = [
  {
    role: 'Senior UX Designer',
    company: 'Design Studio Co',
    period: '2021 - Present',
    description: 'Leading design for enterprise SaaS products serving 2M+ users.',
  },
  {
    role: 'Product Designer',
    company: 'TechCorp Inc',
    period: '2018 - 2021',
    description: 'Designed mobile banking app and healthcare patient portal.',
  },
  {
    role: 'UX Researcher',
    company: 'Research Lab',
    period: '2016 - 2018',
    description: 'Conducted user research for Fortune 500 clients.',
  },
];

const skills = [
  { category: 'Research', items: ['User Interviews', 'Usability Testing', 'Surveys', 'Analytics', 'A/B Testing'] },
  { category: 'Design', items: ['Wireframing', 'Prototyping', 'Visual Design', 'Design Systems', 'Motion Design'] },
  { category: 'Tools', items: ['Figma', 'Framer', 'Principle', 'Miro', 'Maze', 'Hotjar'] },
  { category: 'Methods', items: ['Design Thinking', 'Jobs to be Done', 'Agile/Scrum', 'Design Sprints'] },
];

export default function AboutPage() {
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="container-custom mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="label text-ux-primary mb-4 block">About Me</span>
            <h1 className="heading-xl mb-6">
              Designing with
              <span className="block text-gradient">purpose & empathy</span>
            </h1>
            <p className="body-lg mb-8">{profile.bio}</p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-ux-muted">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="/resume.pdf" className="btn-primary inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-ux-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-ux-secondary/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-padding bg-ux-card/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="label text-ux-primary mb-4 block">My Story</span>
              <h2 className="heading-md mb-8">A bit more about me</h2>
              <div className="prose prose-invert prose-lg">
                {profile.longBio.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-ux-muted leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="label text-ux-primary mb-4 block">Experience</span>
            <h2 className="heading-lg">Where I&apos;ve Worked</h2>
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-ux-primary">{exp.company}</p>
                  </div>
                  <span className="text-ux-muted">{exp.period}</span>
                </div>
                <p className="text-ux-muted">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding bg-ux-card/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="label text-ux-primary mb-4 block">Skills</span>
            <h2 className="heading-lg">What I Bring</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="text-ux-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ux-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="label text-ux-primary mb-4 block">Services</span>
            <h2 className="heading-lg mb-6">How I Can Help</h2>
            <p className="body-lg max-w-2xl mx-auto">
              From research to launch, I provide comprehensive design services tailored to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hover p-8 text-center"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-ux-muted">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
