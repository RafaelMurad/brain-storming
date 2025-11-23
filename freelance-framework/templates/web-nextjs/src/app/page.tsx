import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'Crafted with attention to detail and modern aesthetics.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Server-side rendering for instant page loads.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Built with security best practices in mind.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="label text-primary-500 mb-4 block">Welcome</span>
            <h1 className="heading-xl mb-6">
              Build something
              <span className="block text-gradient">amazing today</span>
            </h1>
            <p className="body-lg mb-8 max-w-xl mx-auto">
              A modern Next.js 14 template with server components, TypeScript,
              Tailwind CSS, and everything you need to build fast.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about" className="btn-primary">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="label text-primary-500 mb-4 block">Features</span>
            <h2 className="heading-lg">Why choose us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-16">
            <h2 className="heading-md mb-4">Ready to get started?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of developers building amazing products.
            </p>
            <Link
              href="/contact"
              className="btn bg-white text-primary-600 hover:bg-white/90"
            >
              Start Building
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
