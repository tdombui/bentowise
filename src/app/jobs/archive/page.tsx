// /app/jobs/archive/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Navbar from "@/app/components/nav/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/app/components/nav/Footer";

export const dynamic = "force-dynamic";

export default async function ArchivedJobsPage() {
    const { data: jobs, error } = await supabase
        .from("jobs")
        .select(
            `
      id,
      service_description,
      estimated_price,
      status,
      completion_date,
      vehicles (
        make,
        model,
        year
      )
    `
        )
        .eq("status", "Archived")
        .order("completion_date", { ascending: false });

    if (error) {
        console.error("Error fetching archived jobs:", error);
        notFound();
    }

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold">Archived Jobs</h1>

                {jobs && jobs.length > 0 ? (
                    <ul className="space-y-3">
                        {jobs.map((job) => (
                            <li
                                key={job.id}
                                className="border p-3 rounded bg-neutral-100 hover:bg-neutral-200 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {job.vehicles
                                            ? `${job.vehicles.year || ""} ${job.vehicles.make || ""} ${job.vehicles.model || ""}`
                                            : "Unknown Vehicle"}
                                    </p>
                                    <p className="font-medium">{job.service_description}</p>
                                    <p className="text-sm text-gray-500">
                                        Completed: {job.completion_date || "Unknown"}
                                    </p>
                                </div>
                                <Link
                                    href={`/jobs/${job.id}`}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No archived jobs found.</p>
                )}
            </div>
            <Footer />
        </>
    );
}
