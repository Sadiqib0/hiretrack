'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { FileText, Plus, Search, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { AddApplicationModal } from '@/components/applications/AddApplicationModal';
import { applicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { exportToCSV } from '@/lib/exportToCSV';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleExport = () => {
    if (filteredApplications.length === 0) {
      toast.error('No applications to export');
      return;
    }

    const exportData = filteredApplications.map(app => ({
      'Job Title': app.jobTitle,
      'Company': app.company,
      'Location': app.location || '',
      'Salary': app.salary || '',
      'Status': app.status,
      'Applied Date': new Date(app.appliedAt).toLocaleDateString(),
      'Job URL': app.jobUrl || '',
      'Notes': app.notes || '',
    }));

    exportToCSV(exportData, `applications-${new Date().toISOString().split('T')[0]}`);
    toast.success('Applications exported successfully!');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(app => app.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('No applications selected');
      return;
    }

    if (!confirm(`Delete ${selectedIds.length} application(s)?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => applicationsApi.delete(id)));
      toast.success(`${selectedIds.length} application(s) deleted`);
      setSelectedIds([]);
      fetchApplications();
    } catch (error) {
      console.error('Failed to delete applications:', error);
      toast.error('Failed to delete some applications');
    } finally {
      setIsDeleting(false);
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
          {/* Header with Export and Add buttons */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                <p className="mt-2 text-gray-600">
                  Track and manage all your job applications
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={filteredApplications.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedIds.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  isLoading={isDeleting}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          {applications.length > 0 && (
            <div className="mt-6 px-4 sm:px-0">
              <div className="flex gap-4 items-center">
                {/* Select All Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={toggleSelectAll}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                    Select All
                  </label>
                </div>

                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by company or position..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          )}

          {/* Applications List */}
          <div className="mt-8 px-4 sm:px-0">
            {filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(application.id)}
                      onChange={() => toggleSelect(application.id)}
                      className="mt-6 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <ApplicationCard
                        application={application}
                        onDelete={fetchApplications}
                        onUpdate={fetchApplications}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by adding your first job application
                </p>
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Application
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No applications found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Add Application Modal */}
        <AddApplicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchApplications}
        />
      </div>
    </ProtectedRoute>
  );
}