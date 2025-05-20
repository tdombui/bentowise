'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface EditCustomerFormProps {
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    zip_code?: string;  // ✅ Correct key
  };
}
export default function EditCustomerForm({ customer }: EditCustomerFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name || '');
  const [email, setEmail] = useState(customer.email || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [zipCode, setZipCode] = useState(customer.zip_code || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from('customers')
      .update({ name, email, phone, zip_code: zipCode })
      .eq('id', customer.id)
      .select()
      .single();
    if (error || !data) {
      setMessage('Failed to update customer.');
      console.error('Error:', error);
    } else {
      setMessage(`Customer ${data.name} updated successfully!`);
      router.refresh();
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
      >
        {isEditing ? 'Cancel Edit' : 'Edit Customer'}
      </button>
      {isEditing && (
        <div className="space-y-2 mt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer Name"
            className="w-full p-2 rounded border bg-neutral-800"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-2 rounded border bg-neutral-800"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-2 rounded border bg-neutral-800"
          />
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="ZIP Code"
            className="w-full p-2 rounded border bg-neutral-800"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>
      )}
    </div>
  );
}
