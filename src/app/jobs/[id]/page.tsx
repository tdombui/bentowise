import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import Navbar from "@/app/components/nav/Navbar";
import { notFound } from "next/navigation";
import JobPhotoUploader from "@/app/components/JobPhotoUploader";
import JobPhotoGallery from "@/app/components/JobPhotoGallery";
import CompleteJobButton from "@/app/components/buttons/CompleteJobButton";
import DeleteJobButton from "@/app/components/buttons/DeleteJobButton";
import ArchiveJobButton from "@/app/components/buttons/ArchiveJobButton";
import ReopenJobButton from "@/app/components/buttons/ReopenJobButton";
import EditableJobOverview from "@/app/components/JobEditForm";
import { ArrowLeft, Printer, ReceiptText, Mail } from "lucide-react";
import Footer from "@/app/components/nav/Footer";

export const dynamic = "force-dynamic";

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {

  const { id: jobId } = await params;
  const { data: photos, error: photosError } = await supabase
    .from("job_photos")
    .select("id, image_url")
    .eq("job_id", jobId);

  if (photosError) {
    console.error("Error fetching photos:", photosError);
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
    id,
    vehicle_id,
    service_description,
    estimated_price,
    status,
    completion_date,
    customers(name),
    vehicles (
      id,
      make,
      model,
      year,
      color,
      license_plate,
      vin
    ),
    mileage
  `)
    .eq("id", jobId)
    .single();

  if (error || !job) {
    notFound();
  }

  const singleJob = {
    ...job,
    vehicles: Array.isArray(job.vehicles) ? job.vehicles[0] : job.vehicles,
  };


  return (
    <>
      <Navbar />

      <div className="p-3 max-w-md mx-auto space-y-6"></div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Link href="/jobs">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <h1 className="text-3xl font-bold">Job Details</h1>
          </div>
          {job.status === "Completed" ? (
            <ReopenJobButton jobId={params.id} />
          ) : (
            <CompleteJobButton jobId={params.id} />
          )}
        </div>

        <EditableJobOverview job={singleJob} />

        <div className="border p-4 rounded shadow space-y-2">
          {photos && photos.length > 0 && <JobPhotoGallery photos={photos} />}
          <JobPhotoUploader jobId={params.id} />
        </div>

        <div className="border p-4 rounded shadow space-y-2">
          <h2 className="text-md font-semibold mb-4">Manage Job</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/jobs/invoices/${params.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <div className="flex">
                <ReceiptText className="mr-2" /> View Invoice
              </div>
            </Link>
            <Link
              href={`/jobs/invoices/${params.id}/print`}
              target="_blank"
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
            >
              <div className="flex">
                <Printer className="mr-2" /> Print Invoice
              </div>
            </Link>
            <Link
              href={`/jobs/invoices/${params.id}?action=email`}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              <div className="flex">
                <Mail className="mr-2" /> Email Invoice to Customer
              </div>
            </Link>
            <div className="flex space-x-2">
              <ArchiveJobButton jobId={params.id} />          <DeleteJobButton jobId={params.id} />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
