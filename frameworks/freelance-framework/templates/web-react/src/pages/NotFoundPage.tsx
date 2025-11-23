import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="heading-md mb-4">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <Home className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
