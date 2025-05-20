'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';

interface JobPhotoUploaderProps {
  jobId: string;
}

export default function JobPhotoUploader({ jobId }: JobPhotoUploaderProps) {
  const [status, setStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId); // Make sure you have jobId in scope

    const response = await fetch('/api/upload-job-photo', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Upload result:', result);

    if (!response.ok) {
      setStatus(`Upload failed: ${result.error?.message || 'Unknown error'}`);
    } else {
      setStatus('Photo uploaded successfully');
    }
  };


  return (
    <div className="space-y-2">
      <p className="font-semibold">Upload Job Photo</p>

      <input
        id="file-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="file-upload"
        className="inline-block bg-amber-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-amber-700 transition"
      >
        <div className="flex"><Camera className="mr-2" /> Take Photo / Upload File </div>
      </label>

      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
