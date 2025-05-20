'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


export default function ReopenJobButton({ jobId }: { jobId: string }) {
    const router = useRouter();

    const reopenJob = async () => {
        const { error } = await supabase
            .from('jobs')
            .update({ status: 'In Progress', completion_date: null })
            .eq('id', jobId);

        if (!error) router.refresh();
    };

    return (
        <button
            onClick={reopenJob}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
            Re-open Job
        </button>
    );
}
