'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase credentials are not configured. Please check .env.local.' };
  }

  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Please verify your credentials.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Please confirm your email address before logging in.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase credentials are not configured. Please check .env.local.' };
  }

  const fullName = (formData.get('fullName') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || 'Student',
      },
    },
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      return { error: 'An account with this email already exists. Please log in.' };
    }
    return { error: error.message };
  }

  // Check if session was created automatically (auto-confirm enabled)
  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }

  // If email confirmation is required by Supabase
  return {
    success: true,
    message: 'Account created! Please check your email to confirm your account, or log in if confirmation is disabled in Supabase.',
  };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

