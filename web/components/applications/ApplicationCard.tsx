'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Calendar, ExternalLink, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { applicationsApi } from '@/lib/api';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  salary?: string;
  status: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  appliedAt: string;
  jobUrl?: string;
}

interface ApplicationCardProps {
  application: Application;
  onDelete: () => void;
  onUpdate: () => void;
}

const statusConfig = {
  APPLIED: { label: 'Applied', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-600' },
  INTERVIEW: { label: 'Interview', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-600' },
  OFFER: { label: 'Offer', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-600' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-600' },
};

export function ApplicationCard({ application, onDelete, onUpdate }: ApplicationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }
  
    setIsDeleting(true);
    try {
      await applicationsApi.delete(application.id);
      toast.success('Application deleted successfully');
      onDelete();
    } catch (error) {
      console.error('Failed to delete application:', error);
      toast.error('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusInfo = statusConfig[application.status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
          <p className="text-gray-600 font-medium">{application.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium', statusInfo.color)}>
            <span className={clsx('w-2 h-2 rounded-full', statusInfo.dotColor)} />
            {statusInfo.label}
          </span>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <Link href={`/applications/${application.id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                  <Edit className="w-4 h-4 mr-2" />Edit
                </Link>
                <button onClick={handleDelete} disabled={isDeleting} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4 mr-2" />{isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        {application.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /><span>{application.location}</span>
          </div>
        )}
        {application.salary && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" /><span>{application.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/applications/${application.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">View Details</Button>
        </Link>
        {application.jobUrl && (
          <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="w-4 h-4 mr-1.5" />Job Posting
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}