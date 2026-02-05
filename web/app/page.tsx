'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Bell, FileText, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HireTrack</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Track Your Job Applications
            <br />
            <span className="text-blue-600">Like a Pro</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop losing track of job applications. Get insights, analytics, and
            reminders to optimize your job search.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FileText className="w-8 h-8 text-blue-600" />,
              title: 'Track Applications',
              description:
                'Organize all your job applications in one place with status tracking.',
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
              title: 'Analytics Dashboard',
              description:
                'Get insights into response rates, interview conversion, and more.',
            },
            {
              icon: <Bell className="w-8 h-8 text-blue-600" />,
              title: 'Smart Reminders',
              description:
                'Never miss a follow-up with automated email reminders.',
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-600" />,
              title: 'Secure & Private',
              description:
                'Your data is encrypted and secure. We never share your information.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Job Search?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of job seekers using HireTrack
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Start Tracking Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 HireTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
