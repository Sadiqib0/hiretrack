'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { FileText, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react';
import { applicationsApi } from '@/lib/api';
import { AddApplicationModal } from '@/components/applications/AddApplicationModal';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        applicationsApi.getStats(),
        applicationsApi.getAll(),
      ]);
      setStats(statsRes.data);
      setRecentApplications(appsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Applications', value: stats?.total || 0, icon: FileText, color: 'bg-blue-500' },
    { name: 'Interviews', value: stats?.byStatus?.INTERVIEW || 0, icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Pending', value: stats?.byStatus?.APPLIED || 0, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Offers', value: stats?.byStatus?.OFFER || 0, icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}! 👋</h1>
            <p className="mt-2 text-gray-600">Here's what's happening with your job applications</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition cursor-pointer" onClick={() => router.push('/applications')}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${stat.color} rounded-lg p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button onClick={() => setIsAddModalOpen(true)} className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <Plus className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Add Application</h3>
                <p className="mt-1 text-sm text-gray-500">Track a new job application</p>
              </button>
              <Link href="/analytics" className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">View Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">See your application insights</p>
              </Link>
              <Link href="/applications" className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <FileText className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">All Applications</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage all apps</p>
              </Link>
            </div>
          </div>

          <div className="mt-8 px-4 sm:px-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
              <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
            </div>
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="bg-white shadow-sm rounded-lg divide-y">
                {recentApplications.map((app) => (
                  <Link key={app.id} href={`/applications/${app.id}`} className="block p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{app.jobTitle}</h3>
                        <p className="text-sm text-gray-600">{app.company}</p>
                      </div>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{app.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by adding your first job application</p>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4 mr-2" />Add your first application
                </button>
              </div>
            )}
          </div>
        </main>
        <AddApplicationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchData} />
      </div>
    </ProtectedRoute>
  );
}