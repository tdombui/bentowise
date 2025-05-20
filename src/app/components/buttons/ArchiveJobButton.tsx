'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Archive } from 'lucide-react';

export default function ArchiveJobButton({ jobId }: { jobId: string }) {
    const router = useRouter();

    const archiveJob = async () => {
        const { error } = await supabase
            .from('jobs')
            .update({ status: 'Archived' })
            .eq('id', jobId);

        if (!error) router.refresh();
    };

    return (
        <button
            onClick={archiveJob}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
        >
            <div className="flex"> <Archive className="mr-2" />Archive Job</div>
        </button>
    );
}
