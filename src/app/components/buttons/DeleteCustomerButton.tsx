'use client';
import { useRouter } from 'next/navigation';

interface DeleteCustomerButtonProps {
  customerId: string;
}

export default function DeleteCustomerButton({ customerId }: DeleteCustomerButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    const response = await fetch(`/api/delete-customer?id=${customerId}`, { method: 'DELETE' });

    if (response.ok) {
      router.push('/customers');
    } else {
      alert('Failed to delete customer.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-4 text-red-600 underline cursor-pointer"
    >
      Delete Customer
    </button>
  );
}
