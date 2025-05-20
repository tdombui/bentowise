'use client';
import React, { forwardRef } from 'react';

const PrintableInvoice = forwardRef<HTMLDivElement, { job: any }>(({ job }, ref) => (
  <div ref={ref} className="p-10 text-black bg-white w-[8.5in] h-[11in] flex flex-col justify-between">
    <h1 className="text-4xl font-bold mb-2">Manik Motorsports</h1>
    <p className="text-sm mb-6">177 Main Street, Santa Ana, CA, 92704 | (949) 423-2510 | info@manikmotorsports.com</p>

    <hr className="my-4 border-gray-300" />

    <div className="flex justify-between mb-6">
      <div>
        <p><strong>Work Order #:</strong> WO-{job.work_order_number || job.id.substring(0, 6)}</p>
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Date:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    <hr className="my-4 border-gray-300" />

    <div className="grid grid-cols-2 gap-8 mb-2">
      <div>
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
        <p><strong>Name:</strong> {job.customers?.name || 'Unknown'}</p>
        <p><strong>Email:</strong> {job.customers?.email || 'Not Provided'}</p>
        <p><strong>Phone:</strong> {job.customers?.phone || 'Not Provided'}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Vehicle Information</h2>
        <p><strong>Vehicle:</strong> {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}</p>
        <p><strong>Color:</strong> {job.vehicles?.color || 'Not Provided'}</p>
        <p><strong>License Plate:</strong> {job.vehicles?.license_plate || 'Not Provided'}</p>
        <p><strong>VIN:</strong> {job.vehicles?.vin || 'Not Provided'}</p>
      </div>
    </div>

    <hr className="my-4 border-gray-300" />

    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Service Summary</h2>
      <p><strong>Description:</strong> {job.service_description}</p>
    </div>
    <p className="text-xl" ><strong>Estimated Price:</strong> ${job.estimated_price}</p>

    <hr className="my-4 border-gray-300" />
    <p className="text-sm text-center mt-4">Thank you for choosing ShopKong. We appreciate your business!</p>
  </div>
));

PrintableInvoice.displayName = 'PrintableInvoice';
export default PrintableInvoice;
