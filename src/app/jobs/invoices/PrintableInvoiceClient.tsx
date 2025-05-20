'use client';
import { useEffect } from 'react';
import PrintableInvoice from '@/app/components/invoices/PrintableInvoice';

export default function PrintableInvoiceClient({ job }: { job: any }) {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className=" bg-white w-[8.5in] h-[11in] mx-auto">
      <PrintableInvoice job={job} />
    </div>
  );
}
