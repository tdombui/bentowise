'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/nav/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/app/components/nav/Footer';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('name');
  const [customers, setCustomers] = useState<any[]>([]);

  const fetchCustomers = async (query: string = '', sort: 'name' | 'created_at' = 'name') => {
    let request = supabase.from('customers').select('id, name, email, phone, created_at');

    if (query) {
      request = request.ilike('name', `%${query}%`);
    }

    request = request.order(sort, { ascending: true });

    const { data } = await request;
    setCustomers(data || []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCustomers(search, sortBy);
  };

  const handleClear = () => {
    setSearch('');
    fetchCustomers('', sortBy);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as 'name' | 'created_at';
    setSortBy(newSort);
    fetchCustomers(search, newSort);
  };

  return (
    <><Navbar />
      <div className="p-6 max-w-4xl mx-auto space-y-4">

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Link href="/">
              <ArrowLeft className="w-8 h-8 mr-4" />
            </Link>
            <h1 className="text-3xl font-bold">Customers</h1>
          </div>

          <Link
            href="/create-customer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            + New Customer
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              ✕
            </button>
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="sort" className="text-sm">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="border p-2 rounded bg-white text-black"
          >
            <option value="name">Name (A-Z)</option>
            <option value="created_at">Date Added</option>
          </select>
        </div>

        {/* Customer List */}
        <ul className="space-y-2">
          {customers.map((customer) => (
            <li key={customer.id} className="border p-4 rounded flex justify-between items-center bg-neutral-100 hover:bg-neutral-200">
              <div>
                <p><strong>{customer.name}</strong></p>
                <p>{customer.email}</p>
                <p>{customer.phone}</p>
              </div>
              <Link href={`/customers/${customer.id}`} className="text-blue-600 underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}