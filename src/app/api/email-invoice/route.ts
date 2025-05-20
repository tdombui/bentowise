import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';
import { renderInvoiceHtml } from '@/lib/renderInvoiceHtml';


export async function POST(req: Request) {
  const formData = await req.formData();
  const jobId = formData.get('jobId')?.toString();

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  }

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
    .single();

  console.log('Fetched job:', job);
  console.log('Fetching job with ID:', jobId);
  console.log('Job fetch response:', job);
  console.log('Job fetch error:', error);
  if (error || !job || !job.customers?.email) {
    return NextResponse.json({ error: 'Failed to fetch job or customer email not found' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);

  await resend.emails.send({
    from: 'Manik Motorsports <onboarding@resend.dev>',
    to: job.customers.email,
    subject: `Invoice for Work Order #${job.id}`,
    html: renderInvoiceHtml(job),
  });



  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${baseUrl}/jobs/invoices/${jobId}?email=sent`);
}
