import Link from 'next/link';
import Navbar from '@/app/components/nav/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, service_description, estimated_price, created_at, customers(name)')
    .eq('status', 'In Progress')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return <p>Error loading invoices.</p>;
  }

  if (!jobs || jobs.length === 0) {
    return <p>No outstanding invoices.</p>;
  }

  return (
    <><Navbar />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link href="/">
            <ArrowLeft className="w-8 h-8" />
          </Link><h1 className="text-3xl font-bold">Outstanding Invoices</h1></div>
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <p><strong>Customer:</strong> {job.customers?.name || 'Unknown'}</p>
              <p><strong>Services:</strong> {job.service_description}</p>
              <p><strong>Estimated Price:</strong> ${job.estimated_price || 0}</p>
              <p><strong>Invoice Date:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
              <Link href={`/jobs/invoices/${job.id}`} className="text-blue-600 underline">
                View Invoice
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}