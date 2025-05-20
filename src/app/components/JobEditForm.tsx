'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Pencil } from 'lucide-react';

interface Job {
  id: string;
  service_description?: string;
  estimated_price?: number;
  status?: string;
  start_date?: string;
  completion_date?: string;
  mileage?: number | string;
  vehicles?: {
    id?: string;
    year?: number | string;
    make?: string;
    model?: string;
    color?: string;
    license_plate?: string;
    vin?: string;
  };
}

interface ServiceOption {
  id: string;
  name: string;
  base_price: number;
}

export default function JobEditForm({ job }: { job: Job }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [serviceDescription, setServiceDescription] = useState<string[]>(job.service_description?.split(', ') || []);
  const [estimatedPrice, setEstimatedPrice] = useState(job.estimated_price || 0);
  const [status, setStatus] = useState(job.status || 'In Progress');
  const [startDate, setStartDate] = useState(job.start_date || '');
  const [completionDate, setCompletionDate] = useState(job.completion_date || '');
  const [mileage, setMileage] = useState(job.mileage || '');
  const vehicle = job.vehicles || {};
  const [year, setYear] = useState(vehicle.year || '');
  const [make, setMake] = useState(vehicle.make || '');
  const [model, setModel] = useState(vehicle.model || '');
  const [color, setColor] = useState(vehicle.color || '');
  const [licensePlate, setLicensePlate] = useState(vehicle.license_plate || '');
  const [vin, setVin] = useState(vehicle.vin || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('service_options').select('*');
      if (error) {
        console.error('Failed to fetch service options:', error);
      } else {
        setServiceOptions(data || []);
      }
    };
    fetchServices();
  }, []);

  const recalculatePrice = (selectedServices: string[]) => {
    const total = serviceOptions
      .filter((opt) => selectedServices.includes(opt.name))
      .reduce((sum, s) => sum + s.base_price, 0);
    setEstimatedPrice(total);
  };

  const handleServiceToggle = (value: string) => {
    const updatedServices = serviceDescription.includes(value)
      ? serviceDescription.filter(v => v !== value)
      : [...serviceDescription, value];
    setServiceDescription(updatedServices);
    recalculatePrice(updatedServices);
  };

  const handleSave = async () => {
    setSaving(true);

    const { error: jobError } = await supabase
      .from('jobs')
      .update({
        service_description: serviceDescription.join(', '),
        estimated_price: estimatedPrice,
        status,
        start_date: startDate || null,
        completion_date: completionDate || null,
        mileage,
      })
      .eq('id', job.id);

    let vehicleError = null;
    if (vehicle?.id) {
      const { error } = await supabase
        .from('vehicles')
        .update({ year, make, model, color, license_plate: licensePlate, vin })
        .eq('id', vehicle.id);
      vehicleError = error;
    }

    if (jobError || vehicleError) {
      setToast(`Error: ${jobError?.message || vehicleError?.message}`);
    } else {
      setToast('Changes saved successfully!');
      router.refresh();
      setEditing(false);
    }

    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = () => setEditing(false);

  const handleMarkAsCompleted = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'Completed', completion_date: today })
      .eq('id', job.id);

    if (!error) router.refresh();
  };

  return (
    <div className={`relative space-y-4 border p-4 rounded shadow bg-neutral-100 transition ${editing ? '' : 'opacity-95'}`}>
      {/* Edit / Save / Cancel Buttons */}
      <div className="absolute top-2 right-2 space-x-2">
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving} className="bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="border px-2 py-1 rounded hover:bg-neutral-300 transition">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
            <div className="flex"><Pencil className="w-4 h-4 items-center mr-2" /> Edit</div>
          </button>
        )}
      </div>

      <h2 className="text-lg font-semibold border-b pb-2">Job Overview</h2>

      {/* Services Multi-Select */}
      <div>
        <label className="block text-sm mb-1">Services</label>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleServiceToggle(option.name)}
              disabled={!editing}
              className={`px-2 py-1 rounded border ${serviceDescription.includes(option.name)
                ? 'bg-emerald-700 text-white'
                : 'bg-neutral-300'
                } ${!editing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated Price */}
      <div>
        <label className="block text-sm mb-1">Estimated Price</label>
        <input
          type="number"
          value={estimatedPrice}
          onChange={e => setEstimatedPrice(Number(e.target.value))}
          disabled={!editing}
          className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
        />
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-sm mb-1">Mileage</label>
        <input
          type="number"
          value={mileage}
          onChange={e => setMileage(e.target.value)}
          disabled={!editing}
          className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
        />
      </div>

      {/* Vehicle Info */}
      <div>
        <label className="block text-sm mb-1">Vehicle</label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs mb-1">Year</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              disabled={!editing}
              className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1">Make</label>
            <input
              type="text"
              value={make}
              onChange={e => setMake(e.target.value)}
              disabled={!editing}
              className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={!editing}
              className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Additional Vehicle Details */}
      {([
        ['Color', color, setColor],
        ['License Plate', licensePlate, setLicensePlate],
        ['VIN', vin, setVin],
      ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).map(
        ([label, value, setter]) => (
          <div key={label}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              disabled={!editing}
              className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''
                }`}
            />
          </div>
        )
      )}

      {/* Dates */}
      <div>
        <label className="block text-sm mb-1">Start Date</label>
        <input
          type="date"
          value={startDate || ''}
          onChange={e => setStartDate(e.target.value)}
          disabled={!editing}
          className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Completion Date</label>
        <input
          type="date"
          value={completionDate || ''}
          onChange={e => setCompletionDate(e.target.value)}
          disabled={!editing}
          className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={!editing}
          className={`w-full p-2 rounded border bg-neutral-300 ${editing ? 'ring-2 ring-emerald-600' : ''}`}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>


      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-700 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
