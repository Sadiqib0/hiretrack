'use client';

import { AddReminderModal } from '@/components/applications/AddReminderModal';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { applicationsApi } from '@/lib/api';
import { ArrowLeft, Building2, MapPin, DollarSign, Calendar, ExternalLink, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
 

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await applicationsApi.getOne(id);
      setApplication(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      router.push('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await applicationsApi.update(id, formData);
      setApplication(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Failed to update application');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationsApi.delete(id);
      router.push('/applications');
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading application...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!application) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0 mb-6">
            <Link href="/applications" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Applications
            </Link>
          </div>
          <div className="px-4 sm:px-0 mb-6">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="text-2xl font-bold" />
                    <Input name="company" value={formData.company} onChange={handleChange} className="text-xl" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{application.jobTitle}</h1>
                    <p className="mt-2 text-xl text-gray-600 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />{application.company}
                    </p>
                  </>
                )}
              </div> 
              <div className="flex gap-2">
  {isEditing ? (
    <>
      <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(application); }}>Cancel</Button>
      <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
        <Save className="w-4 h-4 mr-2" />Save Changes
      </Button>
    </>
  ) : (
    <>
      <Button variant="outline" onClick={() => setIsReminderModalOpen(true)}>
        <Bell className="w-4 h-4 mr-2" />Reminder
      </Button>
      <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
      <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-300 hover:bg-red-50">
        <Trash2 className="w-4 h-4 mr-2" />Delete
      </Button>
    </>
  )}
</div>
              
         </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {isEditing ? (
                <select name="status" value={formData.status} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{application.status}</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />Location
                </label>
                {isEditing ? <Input name="location" value={formData.location || ''} onChange={handleChange} /> : <p className="text-gray-900">{application.location || 'Not specified'}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />Salary Range
                </label>
                {isEditing ? <Input name="salary" value={formData.salary || ''} onChange={handleChange} /> : <p className="text-gray-900">{application.salary || 'Not specified'}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />Applied Date
                </label>
                <p className="text-gray-900">{new Date(application.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ExternalLink className="w-4 h-4 inline mr-1" />Job URL
                </label>
                {isEditing ? (
                  <Input name="jobUrl" type="url" value={formData.jobUrl || ''} onChange={handleChange} />
                ) : application.jobUrl ? (
                  <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 truncate block">View Job Posting</a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              {isEditing ? (
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={6} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes about this application..." />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                  <p className="text-gray-900 whitespace-pre-wrap">{application.notes || 'No notes added yet'}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <AddReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          onSuccess={() => {
            alert('Reminder set successfully!');
            setIsReminderModalOpen(false);
          }}
          applicationId={id}
          applicationTitle={`${application.jobTitle} at ${application.company}`}
        />
    </ProtectedRoute>
  );
}