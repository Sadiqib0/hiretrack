'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, TrendingUp, Bell, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Never miss a follow-up with automated email reminders',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualize your job search progress with interactive charts',
    },
    {
      icon: TrendingUp,
      title: 'Track Success',
      description: 'Monitor your interview rates and application success',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HireTrack
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Job Search
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize applications, set reminders, and analyze your job search progress.
            Land your dream job faster with HireTrack.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Free Forever</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-gray-600">Unlimited Applications</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Access Anytime</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to organize your job search?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of job seekers using HireTrack to land their dream jobs.
          </p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 HireTrack. Built with ❤️ for job seekers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}