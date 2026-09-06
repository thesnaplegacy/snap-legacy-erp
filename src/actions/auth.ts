'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export async function signInWithEmail(formData: FormData) {
  if (IS_DEMO) {
    const cookieStore = await cookies();
    cookieStore.set('demo_session', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect('/');
  }

  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Update last_login_at
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  redirect('/');
}

export async function quickDemoLogin() {
  const cookieStore = await cookies();
  cookieStore.set('demo_session', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/');
}

export async function signUp(formData: FormData) {
  if (IS_DEMO) {
    return { success: 'Demo mode: Registration simulated successfully.' };
  }

  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Check your email for a confirmation link.' };
}

export async function signOut() {
  if (IS_DEMO) {
    const cookieStore = await cookies();
    cookieStore.delete('demo_session');
    redirect('/login');
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
