'use client';

import { ProtectedRoute } from '@/components/Protectedroute';
import { Navbar } from '@/components/Navbar';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="mt-2 text-gray-600">
                Track and manage all your job applications
              </p>
            </div>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 px-4 sm:px-0">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by company or position..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Applications List - Empty State */}
          <div className="mt-8 px-4 sm:px-0">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding your first job application
              </p>
              <Button variant="primary" className="mt-6">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Application
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}