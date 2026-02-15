'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import axios from 'axios';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applicationId: string;
  applicationTitle: string;
}

export function AddReminderModal({
  isOpen,
  onClose,
  onSuccess,
  applicationId,
  applicationTitle,
}: AddReminderModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem('access_token');
      
      // Debug log
      console.log('Creating reminder with data:', {
        applicationId,
        title: formData.title,
        description: formData.description,
        reminderDate: formData.reminderDate,
      });
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reminders`,
        {
          applicationId,
          title: formData.title,
          description: formData.description,
          reminderDate: formData.reminderDate,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Reminder created successfully:', response.data);
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', reminderDate: '' });
    } catch (err: any) {
      console.error('Failed to create reminder:', err);
      console.error('Error response:', err.response?.data);
      
      // Better error message
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to create reminder. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Reminder" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Application:</strong> {applicationTitle}
          </p>
        </div>

        <Input
          label="Reminder Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Follow up on application"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Date & Time
          </label>
          <input
            type="datetime-local"
            name="reminderDate"
            value={formData.reminderDate}
            onChange={handleChange}
            min={today}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any notes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Set Reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}