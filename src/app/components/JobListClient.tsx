'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  service_description: string;
  estimated_price: number;
  vehicles?: {
    id: string;
    year?: number;
    make?: string;
    model?: string;
  }[];

}

interface JobListClientProps {
  jobs: Job[];
}

export default function JobListClient({ jobs }: JobListClientProps) {
  const [jobList, setJobList] = useState(jobs);

  const handleDeleteJob = async (jobId: string) => {
    const confirmed = confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    const response = await fetch(`/api/delete-job/${jobId}`, { method: 'DELETE' });

    if (response.ok) {
      setJobList(jobList.filter((job) => job.id !== jobId));
    } else {
      console.error('Failed to delete job');
    }
  };

  return (
    <ul className="space-y-2">
      {jobList.map((job) => (
        <li key={job.id} className="flex justify-between items-center border p-2 rounded">
          <span>
            {job.vehicles?.[0]
              ? `${job.vehicles[0].year || ''} ${job.vehicles[0].make || ''} ${job.vehicles[0].model || ''}`.trim() || 'Unknown Vehicle'
              : 'Unknown Vehicle'}
            — {job.service_description}
          </span>
          <div className="flex space-x-2">
            <Link href={`/jobs/${job.id}`} className="text-blue-600 underline">
              View
            </Link>
            <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 underline">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
