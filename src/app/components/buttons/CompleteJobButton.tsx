'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Check } from 'lucide-react';

interface CompleteJobButtonProps {
  jobId: string;
}

export default function CompleteJobButton({ jobId }: CompleteJobButtonProps) {
  const router = useRouter();

  const handleComplete = async () => {
    const confirmed = confirm('Mark this job as completed?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'Completed', 
        completion_date: new Date().toISOString() 
      })
      .eq('id', jobId);

    if (error) {
      console.error('Failed to mark as completed:', error);
    } else {
      router.refresh();  // Refresh the page to show updated status
    }
  };

  return (
    <button
      onClick={handleComplete}
      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-800 transition cursor-pointer"
    >
      <div className="flex"><Check className="mr-2"/>Mark as Completed</div> 
    </button>
  );
}
