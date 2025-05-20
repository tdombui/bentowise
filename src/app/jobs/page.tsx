import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/app/components/nav/Navbar';
import JobsListClient from './JobsListClient';
import Footer from '@/app/components/nav/Footer';

export const metadata = {
  title: 'ShopKong - Jobs',
  description: 'View and manage your jobs in ShopKong.',
};

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      id,
      work_order_number,
      service_description,
      estimated_price,
      status,
      completion_date,
      customers(name),
      vehicles(id, make, model, year, color, license_plate, vin),
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error || !jobs) {
    return <p className="p-6">Error loading jobs or no jobs found.</p>;
  }

  return (
    <>
      <Navbar />
      <JobsListClient jobs={jobs} />
      <Footer />

    </>
  );
}
