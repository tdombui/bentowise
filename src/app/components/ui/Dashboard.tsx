"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/nav/Navbar";
import { supabase } from "@/lib/supabaseClient";
import TotalIncomeTrendChart from "@/app/components/ui/TotalIncomeTrendChart";
import QuarterlyIncomeChart from "@/app/components/ui/QuarterlyIncomeChart";
import IncomeChart from "@/app/components/ui/IncomeChart";
import {
  Activity,
  ChartColumn,
  Laugh,
  Receipt,
  Search,
  Settings,
  SquareGanttChart,
} from "lucide-react";
import Footer from "@/app/components/nav/Footer";

interface Job {
  id: string;
  service_description: string;
  estimated_price: number;
  vehicles: { year?: number; make?: string; model?: string } | null;
}

export default function DashboardContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  interface Invoice {
    id: string;
    service_description: string;
    estimated_price: number;
    created_at: string;
  }

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select(
          "id, service_description, estimated_price, vehicles(id, year, make, model)"
        )
        .eq("status", "In Progress");
      setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);
  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, work_order_number, service_description, estimated_price, created_at, vehicles(make, model, year)"
        )
        .eq("status", "In Progress")
        .order("created_at", { ascending: false })
        .limit(5);

      console.log("Fetched Invoices Tile Data:", data); // ✅ Add this for debugging
      setInvoices(data || []);
    };

    fetchInvoices();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Jobs In Progress */}
          <div className="border p-4 rounded-xl shadow space-y-2 ">
            <div className="flex items-center mb-6">
              <Activity className="mr-2" />
              <h2 className="text-xl font-semibold">Active Jobs</h2>
              <Link
                href="/jobs"
                className="ml-auto text-sm text-blue-500 underline hover:text-blue-400"
              >
                View All Jobs
              </Link>
            </div>

            {jobs.length > 0 ? (
              <ul className="space-y-2 ">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex justify-between items-center border p-2 rounded text-sm bg-neutral-100 hover:bg-neutral-300"
                  >
                    <span >
                      {job.vehicles
                        ? `${job.vehicles.year || ""} ${job.vehicles.make || ""} ${job.vehicles.model || ""}`.trim() ||
                        "Unknown Vehicle"
                        : "Unknown Vehicle"}
                      {" — "}
                      <br />
                      {job.service_description}
                    </span>
                    <Link href={`/jobs/${job.id}`} className="text-blue-600">
                      {" "}
                      <Settings />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No in-progress jobs.</p>
            )}
          </div>

          {/* Estimated Revenue */}
          <TotalIncomeTrendChart />

          {/* Latest Invoices */}
          <div className="border p-4 rounded-xl shadow space-y-2">
            <div className="flex items-center mb-2">
              <Receipt className="mr-2" />
              <h2 className="text-xl font-semibold">Latest Invoices</h2>
              <Link
                href="/jobs/invoices"
                className="ml-auto text-sm text-blue-500 underline hover:text-blue-400"
              >
                View All Invoices
              </Link>
            </div>

            {invoices.length > 0 ? (
              <ul className="space-y-2">
                {invoices.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="flex justify-between text-sm items-center border p-2 rounded bg-neutral-100 hover:bg-neutral-300"
                  >
                    <span>
                      {"#"}
                      {invoice.work_order_number || "N/A"}
                      {"_"}
                      {invoice.vehicles?.model
                        ? ` ${invoice.vehicles.model}`
                        : ""}
                      {" - "}
                      {invoice.service_description}
                    </span>{" "}
                    <Link
                      href={`/jobs/invoices/${invoice.id}`}
                      className="text-blue-600 underline"
                    >
                      <Search />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No invoices available.</p>
            )}
          </div>
          <IncomeChart />

          {/* Create New Job */}
          <Link
            href="/new-job"
            className="border p-4 rounded-xl shadow hover:bg-emerald-300 transition"
          >
            <div className="flex">
              <SquareGanttChart className="mr-2" />
              <h2 className="text-xl font-semibold mb-6">Add New Job</h2>
            </div>
            <p className="text-gray-800">Start a new service order</p>
          </Link>

          {/* Create New Customer */}
          {/* Customers Management */}
          <div className="border p-4 rounded-xl shadow space-y-2 hover:bg-blue-300 transition">
            <div className="flex items-center mb-4">
              <Laugh className="mr-2" />
              <h2 className="text-xl font-semibold">Customers</h2>
              <Link
                href="/customers"
                className="ml-auto text-sm text-blue-500 underline hover:text-blue-400"
              >
                View All Customers
              </Link>
            </div>
            <p className="text-gray-800 mb-2">Manage your customer base</p>
            <Link
              href="/create-customer"
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              + Add New Customer
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
