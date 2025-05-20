import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CustomerEditForm from '@/app/components/CustomerEditForm';
import DeleteCustomerButton from '@/app/components/buttons/DeleteCustomerButton';
import Navbar from '@/app/components/nav/Navbar';

interface CustomerPageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export default async function CustomerDetailPage({ params }: CustomerPageProps) {
  const customerId = params.id;
  // Fetch customer details
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id, name, email, phone, zip_code')
    .eq('id', customerId)
    .single();

  if (customerError || !customer) {
    notFound();
  }
  // Fetch customer vehicles
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, make, model, year, color, license_plate, vin')
    .eq('customer_id', customerId);
  // Fetch customer jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, service_description, estimated_price, status, completion_date')
    .eq('customer_id', customerId);
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Navbar />

      <div className="flex items-center space-x-2 mb-4">
        <Link href="/customers"><ArrowLeft className="w-8 h-8" /></Link>
        <h1 className="text-3xl font-bold">{customer.name}</h1>
      </div>

      <div className="border p-4 rounded space-y-2">
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Zip code:</strong> {customer.zip_code}</p>
      </div>
      <CustomerEditForm customer={customer} />
      {/* Vehicles Section */}
      <div className="border p-4 rounded space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Vehicles</h2>
          <Link href={`/new-vehicle?customerId=${customer.id}`} className="text-sm text-blue-600 underline">
            Add Vehicle
          </Link>
        </div>
        {vehicles?.length ? (
          <ul className="space-y-2">
            {vehicles.map(vehicle => (
              <li key={vehicle.id} className="border p-2 rounded">
                {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.license_plate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>

      {/* Jobs Section */}
      <div className="border p-4 rounded space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <Link href={`/new-job?customerId=${customer.id}`} className="text-sm text-blue-600 underline">
            Add Job
          </Link>
        </div>
        {jobs?.length ? (
          <ul className="space-y-2">
            {jobs.map(job => (
              <li key={job.id} className="border p-2 rounded flex justify-between">
                <span>{job.service_description} - ${job.estimated_price} ({job.status})</span>
                <Link href={`/jobs/${job.id}`} className="text-blue-600 underline">View</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      <DeleteCustomerButton customerId={customer.id} />

    </div>
  );
}
