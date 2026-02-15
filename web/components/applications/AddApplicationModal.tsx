'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { applicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddApplicationModal({ isOpen, onClose, onSuccess }: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobUrl: '',
    salary: '',
    description: '',
    status: 'APPLIED',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      await applicationsApi.create(formData);
      toast.success('Application added successfully!');
      onSuccess();
      onClose();
      setFormData({
        jobTitle: '',
        company: '',
        location: '',
        jobUrl: '',
        salary: '',
        description: '',
        status: 'APPLIED',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Application" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Senior Software Engineer" required />
          <Input label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
          <Input label="Salary Range" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $120k - $150k" />
        </div>

        <Input label="Job URL" name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} placeholder="https://..." />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add any notes about this application..." />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>Add Application</Button>
        </div>
      </form>
    </Modal>
  );
}