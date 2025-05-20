'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/app/components/nav/Navbar';
import CustomerSelector from './CustomerSelector';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
}

interface ServiceOption {
  id: string;
  name: string;
  base_price: number;
}

async function getOrCreateVehicle(
  customer_id: string,
  year: number,
  make: string,
  model: string,
  color: string,
  license_plate: string,
  vin: string
): Promise<string | null> {
  const { data: existingVehicle } = await supabase
    .from('vehicles')
    .select('id')
    .eq('customer_id', customer_id)
    .eq('vin', vin)
    .single();

  if (existingVehicle) return existingVehicle.id;

  const { data: newVehicle, error } = await supabase
    .from('vehicles')
    .insert([{ customer_id, year, make, model, color, license_plate, vin }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return newVehicle?.id;
}

export default function NewJobClient() {
  const router = useRouter();

  const [form, setForm] = useState({
    customer_id: '',
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_license_plate: '',
    vehicle_vin: '',
    mileage: '',
    start_date: '',
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [customerStatus, setCustomerStatus] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('service_options').select('*');
      if (error) console.error('Error fetching services:', error);
      else setServiceOptions(data || []);
    };
    fetchServices();
  }, []);

  const totalEstimate = serviceOptions
    .filter((opt) => selectedServices.includes(opt.id))
    .reduce((sum, s) => sum + s.base_price, 0);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleCreateNewCustomer = async () => {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name: customerSearch }])
      .select();

    if (error) {
      setCustomerStatus('Error creating customer.');
    } else if (data && data.length > 0) {
      const newCustomer = data[0];
      setForm({ ...form, customer_id: newCustomer.id });
      setCustomerStatus(`Created and selected: ${newCustomer.name}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = [
      form.customer_id,
      form.vehicle_year,
      form.vehicle_make,
      form.vehicle_model,
      form.mileage,
    ];

    if (requiredFields.includes('') || selectedServices.length === 0) {
      toast.error('Please complete all required fields.');
      return;
    }

    const vehicle_id = await getOrCreateVehicle(
      form.customer_id,
      parseInt(form.vehicle_year),
      form.vehicle_make.trim(),
      form.vehicle_model.trim(),
      form.vehicle_color.trim(),
      form.vehicle_license_plate.trim(),
      form.vehicle_vin.trim()
    );

    if (!vehicle_id) {
      toast.error('Error creating or finding vehicle.');
      return;
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert([
        {
          customer_id: form.customer_id,
          vehicle_id,
          mileage: parseInt(form.mileage),
          service_description: serviceOptions
            .filter((s) => selectedServices.includes(s.id))
            .map((s) => s.name)
            .join(', '),
          status: 'In Progress',
          estimated_price: totalEstimate,
          start_date: form.start_date || null,
          completion_date: null,
        },
      ])
      .select()
      .single();

    if (jobError || !job) {
      console.error(jobError);
      toast.error('Error creating job.');
      return;
    }

    const jobServices = selectedServices.map((service) => ({
      job_id: job.id,
      service_id: service,
    }));

    const { error: jobServiceError } = await supabase.from('job_services').insert(jobServices);

    if (jobServiceError) {
      console.error(jobServiceError);
      toast('Job created, but failed to attach services.');
    } else {
      toast.success('Job created successfully!');
    }

    router.push(`/jobs/${job.id}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-3xl font-bold">Create New Job</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div className="border p-4 rounded-lg mb-4">
            <h2 className="font-semibold mb-2">Customer</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Enter customer name"
                className="flex-1 border p-2 rounded-xl"
              />
              <CustomerSelector
                search={customerSearch}
                onResults={setCustomerResults}
                onStatus={setCustomerStatus}
              />
              <button
                type="button"
                onClick={handleCreateNewCustomer}
                className="bg-blue-600 text-xs text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                + New Customer
              </button>
            </div>
            {customerResults.map((customer) => (
              <div key={customer.id} className="flex justify-between items-center border p-2 mt-2 rounded">
                <span>{customer.name}</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, customer_id: customer.id })}
                  className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                >
                  Select
                </button>
              </div>
            ))}
            {customerStatus && <p className="mt-2 text-sm">{customerStatus}</p>}
          </div>
          {/* Vehicle Info */}
          <div className="border p-4 rounded-lg mb-4">
            <div>
              <h2 className="font-semibold mb-6">Vehicle Info</h2>
              <div className="mb-2">
                <label htmlFor="vehicle_year" className="block text-sm font-medium text-gray-700">Year *</label>
                <input required type="text" id="vehicle_year" name="vehicle_year" value={form.vehicle_year} onChange={handleChange} className="w-full border p-2 rounded-xl" />
              </div>
              <div className="mb-2">
                <label htmlFor="vehicle_make" className="block text-sm font-medium text-gray-700">Make *</label>
                <input required type="text" id="vehicle_make" name="vehicle_make" value={form.vehicle_make} onChange={handleChange} className="w-full border p-2 rounded-xl" />
              </div>
              <div className="mb-2">
                <label htmlFor="vehicle_model" className="block text-sm font-medium text-gray-700">Model *</label>
                <input required type="text" id="vehicle_model" name="vehicle_model" value={form.vehicle_model} onChange={handleChange} className="w-full border p-2 rounded-xl" />
              </div>
              <div className="mb-2">
                <label htmlFor="vehicle_color" className="block text-sm font-medium text-gray-700">Color</label>
                <input type="text" id="vehicle_color" name="vehicle_color" value={form.vehicle_color} onChange={handleChange} className="w-full border p-2 rounded-xl" />
              </div>

              <div className="mb-2">
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage *</label>
                <input required type="number" id="mileage" name="mileage" value={form.mileage} onChange={handleChange} className="w-full border p-2 rounded-xl" />
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="vehicle_license_plate" className="block text-sm font-medium text-gray-700">License Plate</label>
              <input type="text" id="vehicle_license_plate" name="vehicle_license_plate" value={form.vehicle_license_plate} onChange={handleChange} className="w-full border p-2 rounded-xl" />
            </div>

            <div className="mb-2">
              <label htmlFor="vehicle_vin" className="block text-sm font-medium text-gray-700">VIN</label>
              <input type="text" id="vehicle_vin" name="vehicle_vin" value={form.vehicle_vin} onChange={handleChange} className="w-full border p-2 rounded-xl" />
            </div>
          </div>

          {/* Service Selector */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-6">Select Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {serviceOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-1 border rounded-lg px-2 py-1 text-sm cursor-pointer ${selectedServices.includes(option.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(option.id)}
                    onChange={() => toggleService(option.id)}
                    className="form-checkbox scale-90"
                  />
                  <span>{`${option.name} ($${option.base_price})`}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 font-bold text-right text-lg">
              Estimated Total: ${totalEstimate}
            </p>
          </div>
          {/* Start Date */}
          <div className='border p-4 rounded-lg'>
            <h3 className="font-semibold mb-6">Start Date</h3>
            <input
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          {/* Submit */}
          <button type="submit" className="w-full bg-green-700 text-white p-2 font-bold rounded cursor-pointer">
            Create Job
          </button>
        </form>
      </div>
    </>
  );
}
