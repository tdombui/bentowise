
import InvoicesPageClient from './InvoicesListClient';

export const metadata = {
  title: 'BentoWise - Invoices',
  description: 'View and manage your invoices in ShopKong.',
};

export default function InvoicesPage() {
  return <InvoicesPageClient />;
}