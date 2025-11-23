import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Users, Wrench } from 'lucide-react';
import { caseStudies } from '@/data/portfolio';
import ProcessTimeline from '@/components/case-study/ProcessTimeline';
import MetricsGrid from '@/components/case-study/MetricsGrid';
import ImageGallery from '@/components/case-study/ImageGallery';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const study = caseStudies.find((s) => s.slug === params.slug);
  if (!study) return {};

  return {
    title: `${study.title} | Alex Morgan`,
    description: study.overview,
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const study = caseStudies.find((s) => s.slug === params.slug);

  if (!study) {
    notFound();
  }

  const nextStudy = study.nextProject
    ? caseStudies.find((s) => s.slug === study.nextProject)
    : null;

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end pb-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={study.heroImage}
            alt={study.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ux-bg via-ux-bg/50 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          {/* Back link */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-ux-muted hover:text-ux-text transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Work</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${study.color}20`, color: study.color }}
              >
                {study.category}
              </span>
              <span className="text-ux-muted">{study.year}</span>
            </div>

            <h1 className="heading-xl mb-4">{study.title}</h1>
            <p className="text-2xl text-ux-muted">{study.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 border-b border-ux-border/50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ux-card flex items-center justify-center">
                <Clock className="w-5 h-5 text-ux-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Duration</h3>
                <p className="text-ux-muted">{study.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ux-card flex items-center justify-center">
                <Users className="w-5 h-5 text-ux-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Role</h3>
                <p className="text-ux-muted">{study.role}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ux-card flex items-center justify-center">
                <Wrench className="w-5 h-5 text-ux-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Tools</h3>
                <p className="text-ux-muted">{study.tools.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="label mb-4 block" style={{ color: study.color }}>
                Overview
              </span>
              <h2 className="heading-md mb-6">About This Project</h2>
              <p className="body-lg">{study.overview}</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">The Challenge</h3>
                <p className="text-ux-muted leading-relaxed">{study.challenge}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">The Solution</h3>
                <p className="text-ux-muted leading-relaxed">{study.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <ProcessTimeline steps={study.process} color={study.color} />

      {/* Metrics */}
      <MetricsGrid metrics={study.metrics} color={study.color} />

      {/* Gallery */}
      <ImageGallery items={study.gallery} color={study.color} />

      {/* Testimonial */}
      {study.testimonial && (
        <section className="section-padding bg-ux-card/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-3xl md:text-4xl font-display leading-relaxed mb-8">
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={study.testimonial.avatar}
                  alt={study.testimonial.author}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold">{study.testimonial.author}</div>
                  <div className="text-ux-muted">{study.testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next Project */}
      {nextStudy && (
        <section className="py-16 border-t border-ux-border/50">
          <div className="container-custom">
            <Link href={`/work/${nextStudy.slug}`} className="group block">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label text-ux-muted mb-2 block">Next Project</span>
                  <h2 className="heading-md group-hover:text-gradient transition-all duration-300">
                    {nextStudy.title}
                  </h2>
                </div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2"
                  style={{ backgroundColor: nextStudy.color }}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
