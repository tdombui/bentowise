'use client';
import { useRef } from 'react';
import PrintableInvoice from '@/app/components/invoices/PrintableInvoice';

export default function InvoiceClientView({ job }: { job: any }) {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <div ref={printRef} className="scale-50 origin-top-left border rounded shadow-md p-2 bg-white inline-block">
        <PrintableInvoice job={job} />
      </div>
    </div>
  );
}
