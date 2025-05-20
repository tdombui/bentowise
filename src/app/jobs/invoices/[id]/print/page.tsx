import { supabase } from '@/lib/supabaseClient';
import PrintableInvoiceClient from '@/app/jobs/invoices/PrintableInvoiceClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PrintableInvoicePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      id,
      work_order_number,
      service_description,
      estimated_price,
      status,
      created_at,
      customers(name, email, phone),
      vehicles(year, make, model, color, license_plate, vin)
    `)
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  return <PrintableInvoiceClient job={job} />;
}