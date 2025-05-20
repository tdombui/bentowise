'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, LayoutGrid, List as ListIcon } from 'lucide-react';

export default function JobsListClient({ jobs }: { jobs: any[] }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredJobs = jobs
    .filter((job) => statusFilter === 'All' || job.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Heading + Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-3xl font-bold">Job List</h1>
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm">Filter by Status: </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-1 rounded bg-neutral-200 text-black"
            >
              <option value="All">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Sort by Date: </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border p-1 rounded bg-neutral-200 text-black"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-neutral-300 text-black'}`}
              aria-label="Grid View"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-neutral-300 text-black'}`}
              aria-label="List View"
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
        {filteredJobs.map((job) => {
          const statusColor =
            job.status === 'Completed'
              ? 'bg-emerald-900/20 border-emerald-700'
              : job.status === 'In Progress'
                ? 'bg-amber-500/10 border-amber-600'
                : 'bg-neutral-900 border-neutral-700';

          const hoverColor =
            job.status === 'Completed'
              ? 'hover:bg-emerald-800/30'
              : job.status === 'In Progress'
                ? 'hover:bg-amber-500/30'
                : '';

          return (
            <div
              key={job.id}
              className={`border p-4 rounded-xl shadow-sm ${statusColor} ${hoverColor} space-y-1`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold mb-2">
                  {job.work_order_number
                    ? `WO-${job.work_order_number}`
                    : `Job #${job.id.substring(0, 6)}`}
                </h2>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
              </div>
              <hr className="border-t border-neutral-700 mb-2" />

              <div className="space-y-1 text-sm">
                <p>
                  <strong>Customer:</strong> {job.customers?.name || 'Unknown'}
                </p>
                <p>
                  <strong>Vehicle:</strong>{' '}
                  {job.vehicles
                    ? `${job.vehicles.year} ${job.vehicles.make} ${job.vehicles.model}`
                    : 'Unknown'}
                </p>
                <p>
                  <strong>Plate:</strong> {job.vehicles?.license_plate || 'Unknown'}
                </p>
                <p>
                  <strong>VIN:</strong> {job.vehicles?.vin || 'Unknown'}
                </p>
                <p>
                  <strong>Services:</strong> {job.service_description}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong> {job.status}
                </p>
                <hr className="border-t border-neutral-700" />
                <p className="text-lg">
                  <strong>Est. Price:</strong> ${job.estimated_price || 0}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>

  );
}
