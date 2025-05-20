'use client';
import { useRouter } from 'next/navigation';
import { Delete } from 'lucide-react';

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    const response = await fetch('/api/delete-job', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId }),
    });

    if (response.ok) {
      router.push('/jobs'); // Or '/dashboard' if you prefer
    } else {
      console.error('Failed to delete job');
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded cursor-pointer">
      <div className="flex"> <Delete className="mr-2" />
        Delete Job</div>
    </button>
  );
}
