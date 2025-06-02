import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
}

// Server-only Supabase Client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobId = formData.get('jobId') as string | null;

    if (!file || !jobId) {
      console.error('❌ Missing file or jobId');
      return new Response(JSON.stringify({ error: 'Missing file or jobId' }), { status: 400 });
    }

    const filePath = `${jobId}/${Date.now()}_${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/job-photos/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          'Content-Type': file.type,
        },
        body: fileBuffer,
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error('❌ Upload Error:', uploadResult);
      return new Response(JSON.stringify({ error: uploadResult.message || 'Upload failed' }), {
        status: uploadResponse.status,
      });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/job-photos/${filePath}`;

    const { data: photoRecord, error: dbError } = await supabaseAdmin
      .from('job_photos')
      .insert([{ job_id: jobId, image_url: publicUrl }])
      .single();

    if (dbError) {
      console.error('❌ Database insert failed:', dbError);
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, photo: photoRecord }), { status: 200 });

  } catch (err: unknown) {
    console.error('❌ Unexpected server error:', err);
    return new Response(JSON.stringify({ error: 'Unexpected server error' }), { status: 500 });
  }
}
