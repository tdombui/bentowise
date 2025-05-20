'use client';
import { useRef } from 'react';
import PrintableInvoice from '@/app/components/invoices/PrintableInvoice';
interface Job {
  id: string;
  service_description?: string;
  estimated_price?: number;
  status?: string;
  created_at: string;
  start_date?: string;
  completion_date?: string;
  mileage?: number;
  vehicles?: {
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
    vin?: string;
    color?: string;
  };
  customers?: {
    name?: string;
  };
}
type PrintableInvoiceJob = Job & {
  status: string;
  created_at: string;
};
export default function InvoiceClientView({ job }: { job: Job }) {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <div ref={printRef} className="scale-50 origin-top-left border rounded shadow-md p-2 bg-white inline-block">
        <PrintableInvoice job={job as PrintableInvoice} />
      </div>
    </div>
  );
}
