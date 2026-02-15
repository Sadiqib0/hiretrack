'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { AddApplicationModal } from '@/components/applications/AddApplicationModal';
import { applicationsApi } from '@/lib/api';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      const response = await applicationsApi.getAll();
      setApplications(response.data);
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/auth/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    setFilteredApplications(filtered);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
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
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="mt-2 text-gray-600">Track and manage all your job applications</p>
            </div>
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Add Application
            </Button>
          </div>

          {applications.length > 0 && (
            <div className="mt-6 px-4 sm:px-0">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search by company or position..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="ALL">All Status</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          )}
          <div className="mt-8 px-4 sm:px-0">
            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} onDelete={fetchApplications} onUpdate={fetchApplications} />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by adding your first job application</p>
                <Button variant="primary" className="mt-6" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />Add Your First Application
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}>Clear Filters</Button>
              </div>
            )}
          </div>
        </main>
        <AddApplicationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchApplications} />
      </div>
    </ProtectedRoute>
  );
}