'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/app/components/nav/Navbar';
import { ArrowLeft } from 'lucide-react';

export default function CreateCustomerClient() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    zip_code: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('customers').insert([{
      name: form.name,
      phone: form.phone,
      email: form.email,
      zip_code: parseInt(form.zip_code),
    }]);

    if (error) {
      setStatus('Error creating customer.');
      console.error(error);
    } else {
      setStatus('Customer created successfully!');
      console.log(data);
      setForm({ name: '', phone: '', email: '', zip_code: '' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-3xl font-bold">Create New Customer</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            type="number"
            name="zip_code"
            placeholder="ZIP Code"
            value={form.zip_code}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2">
            Create Customer
          </button>
          {status && <p className="text-emerald-600">{status}</p>}
        </form>
      </div>
    </>
  );
}
