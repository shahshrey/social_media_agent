import Link from 'next/link';
import { useAppTheme } from '../hooks/useAppTheme';

export function LandingPage() {
  const { theme } = useAppTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-8">
          Welcome to <span className={theme.text.gradient}>SocialGenius AI</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          Transform your social media presence with AI-powered content generation and management
        </p>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 rounded-md
              bg-primary text-primary-foreground hover:bg-primary/90
              font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center px-6 py-3 rounded-md
              bg-background text-primary border border-primary
              hover:bg-muted transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
