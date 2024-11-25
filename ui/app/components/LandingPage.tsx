import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8">
          Welcome to <span className="text-indigo-600">SocialGenius AI</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform your social media presence with AI-powered content generation and management
        </p>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
