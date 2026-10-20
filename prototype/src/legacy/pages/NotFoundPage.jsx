import { Link } from '../router.jsx';

export function NotFoundPage() {
  return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center"><h1 className="font-serif text-foreground mb-2">404 - Page Not Found</h1><p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p><Link to="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">Return Home</Link></div></div>;
}

export default NotFoundPage;
