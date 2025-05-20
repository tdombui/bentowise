import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('id');

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
  }

  const { error } = await supabase.from('customers').delete().eq('id', customerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
