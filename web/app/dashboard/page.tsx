'use client';

import { ProtectedRoute } from '@/components/Protectedroute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your job applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
            {[
              {
                name: 'Total Applications',
                value: '0',
                icon: FileText,
                color: 'bg-blue-500',
                change: '+0%',
              },
              {
                name: 'Interviews',
                value: '0',
                icon: TrendingUp,
                color: 'bg-green-500',
                change: '+0%',
              },
              {
                name: 'Pending',
                value: '0',
                icon: Clock,
                color: 'bg-yellow-500',
                change: '+0%',
              },
              {
                name: 'Offers',
                value: '0',
                icon: CheckCircle,
                color: 'bg-purple-500',
                change: '+0%',
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${stat.color} rounded-lg p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <FileText className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Add Application
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track a new job application
                </p>
              </button>

              <button className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  View Analytics
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  See your application insights
                </p>
              </button>

              <button className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <Clock className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Set Reminder
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Never miss a follow-up
                </p>
              </button>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="mt-8 px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            <div className="mt-4 bg-white shadow-sm rounded-lg">
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by adding your first job application
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
                  Add your first application
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}