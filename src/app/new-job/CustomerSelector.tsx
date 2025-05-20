'use client';
import { supabase } from '../../lib/supabaseClient';

interface Customer {
  id: string;
  name: string;
}

interface CustomerSelectorProps {
  search: string;
  //   onSelect: (customerId: string) => void;
  onResults: (results: Customer[]) => void;
  onStatus: (status: string) => void;
}

export default function CustomerSelector({ search, onResults, onStatus }: CustomerSelectorProps) {
  const handleSearch = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .ilike('name', `%${search}%`);

    if (error) {
      console.error(error);
      onStatus('Search failed.');
    } else {
      onResults(data || []);
      onStatus(data?.length ? '' : 'No matching customers.');
    }
  };

  return (
    <button type="button" onClick={handleSearch} className="bg-gray-600 text-white px-3 py-2 rounded-lg cursor-pointer">
      Search
    </button>
  );
}
