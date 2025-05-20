import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import EmailInvoiceButton from '@/app/components/buttons/EmailInvoiceButton';
import InvoiceClientView from '@/app/components/invoices/InvoiceClientView';

export const dynamic = 'force-dynamic';

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const jobId = params.id;

  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
    id,
    work_order_number,
    service_description,
    estimated_price,
    status,
    created_at,
    customers(id, name, email, phone),
    vehicles(year, make, model, color, license_plate, vin)
  `)
    .eq('id', jobId)
    .eq('status', 'In Progress')
    .single();



  if (error || !job) {
    notFound();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Link href="/jobs/invoices">
          <ArrowLeft className="w-8 h-8" />
        </Link>
        <h1 className="text-3xl font-bold">Invoice Details</h1>
      </div>

      <div className="border p-4 rounded shadow space-y-2">
        <p><strong>Invoice ID:</strong> {job.id}</p>
        <p><strong>Customer:</strong> {job.customers?.name || 'Unknown'}</p>
        <p><strong>Services:</strong> {job.service_description}</p>
        <p><strong>Estimated Price:</strong> ${job.estimated_price || 0}</p>
        <p><strong>Invoice Date:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
        <Link href={`/jobs/invoices/${job.id}/print`} target="_blank" className="mt-4 inline-block bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition">
          Print Invoice
        </Link>
        <EmailInvoiceButton jobId={job.id} />

      </div>

      <InvoiceClientView job={job} />
    </div>
  );
}
