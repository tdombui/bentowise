export function renderInvoiceHtml(job: any) {
  return `
    <h1>Manik Motorsports</h1>
    <p>177 Main Street, Santa Ana, CA, 92704 | (949) 423-2510 | info@manikmotorsports.com</p>
    <hr />
    <h2>Work Order #: WO-${job.work_order_number || job.id.substring(0, 6)}</h2>
    <p>Status: ${job.status}</p>
    <p>Date: ${new Date(job.created_at).toLocaleDateString()}</p>
    <hr />
    <h2>Customer Information</h2>
    <p>Name: ${job.customers?.name || 'Unknown'}</p>
    <p>Email: ${job.customers?.email || 'Not Provided'}</p>
    <p>Phone: ${job.customers?.phone || 'Not Provided'}</p>
    <hr />
    <h2>Vehicle Information</h2>
    <p>Vehicle: ${job.vehicles?.year} ${job.vehicles?.make} ${job.vehicles?.model}</p>
    <p>Color: ${job.vehicles?.color || 'Not Provided'}</p>
    <p>License Plate: ${job.vehicles?.license_plate || 'Not Provided'}</p>
    <p>VIN: ${job.vehicles?.vin || 'Not Provided'}</p>
    <hr />
    <h2>Service Summary</h2>
    <p>Description: ${job.service_description}</p>
    <p>Estimated Price: $${job.estimated_price}</p>
    <hr />
    <p>Thank you for choosing ShopKong. We appreciate your business!</p>
  `;
}
