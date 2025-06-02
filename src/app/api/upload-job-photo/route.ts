import { createClient } from '@supabase/supabase-js';

// Server-only Supabase Client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;

    console.log('📝 Received form data:', { file, jobId });

    if (!file || !jobId) {
      console.error('❌ Missing file or jobId');
      return new Response(JSON.stringify({ error: 'Missing file or jobId' }), { status: 400 });
    }

    const filePath = `${jobId}/${Date.now()}_${file.name}`;
    console.log('📦 Uploading to path:', filePath);

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await fetch(
      `${process.env.SUPABASE_URL}/storage/v1/object/job-photos/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': file.type,
        },
        body: fileBuffer,
      }
    );

    const uploadResult = await uploadResponse.json();
    console.log('📤 Direct Storage upload response:', uploadResult);

    if (!uploadResponse.ok) {
      console.error('❌ Upload Error:', uploadResult);
      return new Response(JSON.stringify({ error: uploadResult.message || 'Upload failed' }), { status: uploadResponse.status });
    }

    // ✅ Construct public URL
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/job-photos/${filePath}`;

    // ✅ Insert into job_photos table
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
