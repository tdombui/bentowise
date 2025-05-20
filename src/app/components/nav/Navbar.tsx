'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flower, Menu, X } from 'lucide-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const links = [
    { href: '/', label: <Home /> },
    { href: '/jobs', label: 'Jobs' },
    { href: '/customers', label: 'Customers' },
    { href: '/jobs/invoices', label: 'Invoices' },
    { href: '/income', label: 'Sales' },
    { href: '/vehicles', label: 'Vehicles' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <nav className="fixed top-0 left-0 w-full z-50 flex flex-col bg-neutral-800 text-white px-6 py-2 border-b border-neutral-800">
        {/* Branding and Inline Links + Hamburger */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Flower className="w-5 h-5 text-emerald-400" />
            <span className={`${inter.className} text-lg font-bold`}>BentoWise</span>
          </div>

          {/* Inline Links (Desktop Only) */}
          <div className="hidden sm:flex items-center space-x-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 ${pathname === href
                  ? 'border-b-2 border-emerald-500 text-emerald-400'
                  : 'hover:text-emerald-400'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger Always Visible */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Hamburger Content with Animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
            }`}
        >
          <div className="w-full mt-4 flex flex-col space-y-2 mb-6">
            {/* Links on Small Screens */}
            <div className="flex flex-col space-y-2 sm:hidden">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`relative pb-1 ${pathname === href
                    ? 'border-b-2 mb-2 border-emerald-500 text-emerald-400'
                    : 'hover:text-emerald-400'
                    }`}
                >
                  {href === '/' ? (
                    <span className="flex items-center space-x-1">
                      <Home className="h-5 w-5" />
                      <span className="ml-1">Dashboard</span>
                    </span>
                  ) : (
                    label
                  )}
                </Link>
              ))}
            </div>

            <Link
              href="/new-job"
              className="bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
              onClick={() => setMenuOpen(false)}
            >
              + New Job
            </Link>
            <Link
              href="/create-customer"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              + New Customer
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind the navbar */}
      <div className="h-[56px]"></div>
    </div>
  );
}
