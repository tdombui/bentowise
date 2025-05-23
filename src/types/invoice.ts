export interface PrintableInvoiceJob {
    id: string;
    work_order_number?: string;
    status: string;
    created_at: string;
    estimated_price: number;
    service_description: string;
    customers?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    vehicles?: {
        year?: number;
        make?: string;
        model?: string;
        color?: string;
        license_plate?: string;
        vin?: string;
    };
}
