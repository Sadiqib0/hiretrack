'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Bell, Clock, Check, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import Link from 'next/link';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reminders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(response.data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reminders/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReminders();
    } catch (error) {
      console.error('Failed to complete reminder:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reminders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const activeReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reminders...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            </div>
            <p className="text-gray-600">Manage your follow-up reminders</p>
          </div>

          {/* Active Reminders */}
          <div className="mt-6 px-4 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Reminders ({activeReminders.length})
            </h2>

            {activeReminders.length > 0 ? (
              <div className="space-y-3">
                {activeReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                        <Link
                          href={`/applications/${reminder.applicationId}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {reminder.application.jobTitle} at {reminder.application.company}
                        </Link>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(reminder.reminderDate).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          {new Date(reminder.reminderDate) < new Date() && (
                            <span className="text-red-600 font-medium">• Overdue</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleComplete(reminder.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(reminder.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600">No active reminders</p>
              </div>
            )}
          </div>

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="mt-8 px-4 sm:px-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Completed ({completedReminders.length})
              </h2>
              <div className="space-y-3">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-60"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900 line-through">
                            {reminder.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">
                          {reminder.application.jobTitle} at {reminder.application.company}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reminder.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}