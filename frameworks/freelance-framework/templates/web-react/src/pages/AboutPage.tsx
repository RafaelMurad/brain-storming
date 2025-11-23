import { motion } from 'framer-motion';

export function AboutPage() {
  return (
    <div className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="label text-primary-500 mb-4 block">About</span>
          <h1 className="heading-xl mb-6">About Us</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="body-lg mb-6">
              We are a team of passionate developers and designers dedicated to
              building exceptional digital experiences.
            </p>
            <p className="text-muted mb-6">
              Our mission is to help businesses and individuals create beautiful,
              functional, and accessible applications that make a real difference
              in people's lives.
            </p>
            <p className="text-muted">
              With years of experience in web and mobile development, we bring
              expertise in modern technologies and best practices to every project
              we work on.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
