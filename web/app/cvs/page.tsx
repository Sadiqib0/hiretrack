'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { FileText, Upload, Download, Star, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UploadCVModal } from '@/components/applications/UploadCVModal';
import { cvsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CVsPage() {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await cvsApi.getAll();
      setCvs(response.data);
    } catch (error) {
      console.error('Failed to fetch CVs:', error);
      toast.error('Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await cvsApi.setDefault(id);
      toast.success('Default CV updated');
      fetchCVs();
    } catch (error) {
      console.error('Failed to set default:', error);
      toast.error('Failed to set default CV');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this CV?')) return;

    try {
      await cvsApi.delete(id);
      toast.success('CV deleted successfully');
      fetchCVs();
    } catch (error) {
      console.error('Failed to delete CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading CVs...</p>
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
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CVs & Resumes</h1>
                <p className="mt-2 text-gray-600">
                  Upload and manage your CVs for applications
                </p>
              </div>
              <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload CV
              </Button>
            </div>
          </div>

          {/* CVs List */}
          <div className="mt-6 px-4 sm:px-0">
            {cvs.length > 0 ? (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {cv.fileName}
                            </h3>
                            {cv.isDefault && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                <Check className="w-3 h-3" />
                                Default
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span>{(cv.fileSize / 1024).toFixed(2)} KB</span>
                            <span>
                              Uploaded{' '}
                              {new Date(cv.uploadedAt).toLocaleDateString()}
                            </span>
                            {cv.version && <span>Version {cv.version}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {!cv.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(cv.id)}
                            title="Set as default"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(cv.fileUrl, cv.fileName)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cv.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No CVs uploaded yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload your CV to attach to applications
                </p>
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First CV
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Upload Modal */}
        <UploadCVModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={fetchCVs}
        />
      </div>
    </ProtectedRoute>
  );
}