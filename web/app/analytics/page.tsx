'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { applicationsApi } from '@/lib/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await applicationsApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statusData = stats?.byStatus
    ? [
        { name: 'Applied', value: stats.byStatus.APPLIED },
        { name: 'Interview', value: stats.byStatus.INTERVIEW },
        { name: 'Offer', value: stats.byStatus.OFFER },
        { name: 'Rejected', value: stats.byStatus.REJECTED },
      ]
    : [];

  const metricsData = [
    {
      name: 'Response Rate',
      value: parseFloat(stats?.responseRate || '0'),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Interview Rate',
      value: parseFloat(stats?.interviewRate || '0'),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track your job search performance and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stats?.total || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {metricsData.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.name}
                  className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${metric.bgColor} rounded-lg p-3`}>
                        <Icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {metric.name}
                          </dt>
                          <dd className="text-2xl font-semibold text-gray-900">
                            {metric.value.toFixed(1)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Success Rate
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stats?.total > 0
                          ? ((stats.byStatus.OFFER / stats.total) * 100).toFixed(1)
                          : 0}
                        %
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {stats?.total > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 px-4 sm:px-0">
              {/* Application Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Status Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Breakdown Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Applications by Status
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="mt-8 px-4 sm:px-0">
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Activity className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No data yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Start adding job applications to see your analytics
                </p>
              </div>
            </div>
          )}

          {/* Insights */}
          {stats?.total > 0 && (
            <div className="mt-8 px-4 sm:px-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">📊 Key Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                    <p className="text-sm opacity-90">Response Rate</p>
                    <p className="text-2xl font-bold mt-1">
                      {stats.responseRate}%
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      {parseFloat(stats.responseRate) > 30
                        ? '✅ Great! Above average'
                        : '💡 Keep applying to improve this'}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                    <p className="text-sm opacity-90">Interview Conversion</p>
                    <p className="text-2xl font-bold mt-1">
                      {stats.interviewRate}%
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      {parseFloat(stats.interviewRate) > 20
                        ? '🎯 Excellent conversion rate!'
                        : '📈 Focus on quality applications'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}