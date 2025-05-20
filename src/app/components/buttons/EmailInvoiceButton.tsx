'use client';
import React from 'react';

export default function EmailInvoiceButton({ jobId }: { jobId: string }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm('Send invoice email to customer?');
    if (!confirmed) {
      e.preventDefault();
    }
  };

  return (
    <form
      action="/api/email-invoice"
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <button
        type="submit"
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        Email Invoice to Customer
      </button>
    </form>
  );
}
