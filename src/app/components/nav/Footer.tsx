'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-12 py-8 bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">

        {/* Product Links */}
        <div>
          <h2 className="text-white font-semibold mb-2">Product</h2>
          <ul className="space-y-1">
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/documentation" className="hover:text-white">Documentation</Link></li>
            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h2 className="text-white font-semibold mb-2">Company</h2>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h2 className="text-white font-semibold mb-2">Legal</h2>
          <ul className="space-y-1">
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="mt-8 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} BentoWise. All rights reserved.
      </div>
    </footer>
  );
}
