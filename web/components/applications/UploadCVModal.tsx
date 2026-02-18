'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Upload, FileText } from 'lucide-react';
import { cvsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadCVModal({ isOpen, onClose, onSuccess }: UploadCVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Only PDF and Word documents are allowed');
        return;
      }

      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    try {
      await cvsApi.upload(file, { isDefault });
      toast.success('CV uploaded successfully!');
      onSuccess();
      onClose();
      setFile(null);
      setIsDefault(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload CV / Resume" size="md">
      <div className="space-y-4">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="cv-upload"
          />
          <label htmlFor="cv-upload" className="cursor-pointer">
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium">Click to upload CV</p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF or Word document (max 5MB)
                </p>
              </>
            )}
          </label>
        </div>

        {/* Set as Default */}
        {file && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="set-default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="set-default" className="ml-2 text-sm text-gray-700">
              Set as default CV
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            isLoading={isUploading}
            disabled={!file}
          >
            Upload CV
          </Button>
        </div>
      </div>
    </Modal>
  );
}