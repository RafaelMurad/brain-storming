import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'Crafted with attention to detail and modern aesthetics.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance and instant loading.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Built with security best practices in mind.',
  },
];

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="label text-primary-500 mb-4 block">Welcome</span>
            <h1 className="heading-xl mb-6">
              Build something
              <span className="block text-gradient">amazing today</span>
            </h1>
            <p className="body-lg mb-8 max-w-xl mx-auto">
              A modern React template with everything you need to build beautiful,
              fast, and scalable applications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-16">
            <span className="label text-primary-500 mb-4 block">Features</span>
            <h2 className="heading-lg">Why choose us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:border-primary-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-16">
            <h2 className="heading-md mb-4">Ready to get started?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of developers building amazing products.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
              Start Building
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
