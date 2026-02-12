'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { User, Bell, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Settings Sections */}
          <div className="mt-6 space-y-6 px-4 sm:px-0">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    defaultValue={user?.firstName || ''}
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    defaultValue={user?.lastName || ''}
                    placeholder="Doe"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                />

                <div className="flex justify-end">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Bell className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Reminders</p>
                    <p className="text-sm text-gray-500">
                      Get email notifications for follow-ups
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Summary</p>
                    <p className="text-sm text-gray-500">
                      Receive weekly application statistics
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Subscription
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.subscriptionTier} Plan
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {user?.subscriptionTier === 'FREE'
                        ? 'You are on the free plan'
                        : 'Active subscription'}
                    </p>
                  </div>
                  {user?.subscriptionTier === 'FREE' && (
                    <Button variant="primary" size="sm">
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}